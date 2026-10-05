import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  type ReactNode,
} from 'react'
import type { AuthError } from '@supabase/supabase-js'
import { supabase } from '../../supabase'

export type AppRole = 'viewer' | 'creator' | 'organization' | 'student' | 'educator'
export type ContactMethod = 'email' | 'phone'

export type Profile = {
  id: string
  display_name: string
  username: string | null
  bio: string
  country: string
  city: string
  website: string
  social_links: Record<string, string>
  preferred_language: string
  timezone: string
  created_at: string
  updated_at: string
}

export type ProfileInput = Pick<
  Profile,
  'display_name' | 'username' | 'bio' | 'country' | 'city' | 'website' | 'social_links' | 'preferred_language' | 'timezone'
>

type SignUpInput = {
  method: ContactMethod
  contact: string
  password: string
  displayName: string
  username: string
}

type AuthContextValue = {
  isAuthenticated: boolean
  profile: Profile | null
  roles: AppRole[]
  onboardingCompleted: boolean
  loading: boolean
  profileError: string | null
  recoveryRequested: boolean
  clearRecoveryRequest: () => void
  signUp: (input: SignUpInput) => Promise<boolean>
  signIn: (contact: string, password: string) => Promise<void>
  signInWithOAuth: (provider: 'google' | 'apple' | 'facebook') => Promise<void>
  sendMagicLink: (email: string) => Promise<void>
  verifyOtp: (contact: string, method: ContactMethod, token: string) => Promise<void>
  resendOtp: (contact: string, method: ContactMethod) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  signOut: () => Promise<void>
  saveProfile: (input: ProfileInput) => Promise<void>
  saveOnboarding: (role: AppRole, interests: string[], roleFocus: string[]) => Promise<void>
  createOrganization: (name: string, organizationType: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getClient() {
  if (!supabase) {
    throw new Error('Authentication is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }
  return supabase
}

function getAuthRedirectUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).toString()
}

function throwAuthError(error: AuthError | null) {
  if (error) throw new Error(error.message)
}

function normalizeUsername(username: string) {
  return username.trim().replace(/^@+/, '').toLowerCase()
}

function organizationTypeSlug(label: string) {
  const knownTypes: Record<string, string> = {
    'Production Studio': 'production_studio',
    'Educational Institution': 'educational_institution',
    Broadcaster: 'broadcaster',
    'Government / Cultural': 'government_cultural',
    'Brand / Advertiser': 'brand_advertiser',
    'NGO / Non-profit': 'ngo_nonprofit',
    'Events & Festivals': 'events_festivals',
    Distributor: 'distributor',
  }
  const type = knownTypes[label]
  if (!type) throw new Error('Choose a supported organization type.')
  return type
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUserId, setAuthUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<AppRole[]>([])
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [authReady, setAuthReady] = useState(!supabase)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [recoveryRequested, setRecoveryRequested] = useState(false)
  const sessionUserId = useRef<string | null>(null)

  useEffect(() => {
    if (!supabase) return

    let authEventReceived = false
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      authEventReceived = true
      const nextUserId = nextSession?.user.id ?? null
      const userChanged = sessionUserId.current !== nextUserId
      sessionUserId.current = nextUserId
      setAuthUserId(nextUserId)
      if (userChanged) setProfileLoading(Boolean(nextSession))
      if (event === 'PASSWORD_RECOVERY') setRecoveryRequested(true)
      if (event === 'SIGNED_OUT') setRecoveryRequested(false)
      setAuthReady(true)
    })

    void supabase.auth.getSession().then(({ data, error }) => {
      if (authEventReceived) return
      if (error) setProfileError(error.message)
      sessionUserId.current = data.session?.user.id ?? null
      setAuthUserId(sessionUserId.current)
      setProfileLoading(Boolean(data.session))
      setAuthReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let cancelled = false
    const userId = authUserId

    if (!supabase || !userId) {
      setProfile(null)
      setRoles([])
      setOnboardingCompleted(false)
      setProfileLoading(false)
      setProfileError(null)
      return
    }

    setProfile(null)
    setRoles([])
    setOnboardingCompleted(false)
    setProfileLoading(true)
    setProfileError(null)

    void Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId).eq('status', 'active'),
      supabase.from('user_preferences').select('onboarding_completed').eq('user_id', userId).maybeSingle(),
    ]).then(([profileResult, roleResult, preferenceResult]) => {
      if (cancelled) return
      if (profileResult.error || roleResult.error || preferenceResult.error) {
        setProfileError(
          profileResult.error?.message
            ?? roleResult.error?.message
            ?? preferenceResult.error?.message
            ?? 'Unable to load account profile.',
        )
        return
      }
      setProfile(profileResult.data as Profile | null)
      setRoles((roleResult.data ?? []).map(item => item.role as AppRole))
      setOnboardingCompleted(preferenceResult.data?.onboarding_completed ?? false)
    }).catch(failure => {
      if (!cancelled) {
        setProfileError(failure instanceof Error ? failure.message : 'Unable to load account profile.')
      }
    }).finally(() => {
      if (!cancelled) setProfileLoading(false)
    })

    return () => { cancelled = true }
  }, [authUserId])

  const signUp = useCallback(async (input: SignUpInput) => {
    const client = getClient()
    const credentials = input.method === 'email'
      ? { email: input.contact.trim(), password: input.password }
      : { phone: input.contact.replace(/[^\d+]/g, ''), password: input.password }
    const { data, error } = await client.auth.signUp({
      ...credentials,
      options: {
        data: {
          display_name: input.displayName.trim(),
          username: normalizeUsername(input.username),
        },
        emailRedirectTo: getAuthRedirectUrl(),
      },
    })
    throwAuthError(error)
    return Boolean(data.session)
  }, [])

  const signIn = useCallback(async (contact: string, password: string) => {
    const client = getClient()
    const value = contact.trim()
    const credentials = value.includes('@')
      ? { email: value, password }
      : { phone: value.replace(/[^\d+]/g, ''), password }
    const { error } = await client.auth.signInWithPassword(credentials)
    throwAuthError(error)
  }, [])

  const signInWithOAuth = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    const { error } = await getClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: getAuthRedirectUrl() },
    })
    throwAuthError(error)
  }, [])

  const sendMagicLink = useCallback(async (email: string) => {
    const { error } = await getClient().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: getAuthRedirectUrl() },
    })
    throwAuthError(error)
  }, [])

  const verifyOtp = useCallback(async (
    contact: string,
    method: ContactMethod,
    token: string,
  ) => {
    const client = getClient()
    const params = method === 'email'
      ? { email: contact.trim(), token, type: 'signup' as const }
      : { phone: contact.replace(/[^\d+]/g, ''), token, type: 'sms' as const }
    const { error } = await client.auth.verifyOtp(params)
    throwAuthError(error)
  }, [])

  const resendOtp = useCallback(async (
    contact: string,
    method: ContactMethod,
  ) => {
    const client = getClient()
    const { error } = method === 'email'
      ? await client.auth.resend({ type: 'signup', email: contact.trim() })
      : await client.auth.resend({ type: 'sms', phone: contact.replace(/[^\d+]/g, '') })
    throwAuthError(error)
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await getClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getAuthRedirectUrl(),
    })
    throwAuthError(error)
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await getClient().auth.updateUser({ password })
    throwAuthError(error)
    setRecoveryRequested(false)
  }, [])

  const clearRecoveryRequest = useCallback(() => setRecoveryRequested(false), [])

  const signOut = useCallback(async () => {
    const { error } = await getClient().auth.signOut()
    throwAuthError(error)
  }, [])

  const saveProfile = useCallback(async (input: ProfileInput) => {
    if (!authUserId) throw new Error('Sign in before saving your profile.')
    const values = {
      id: authUserId,
      ...input,
      username: normalizeUsername(input.username ?? ''),
    }
    const { data, error } = await getClient().from('profiles').upsert(values).select('*').single()
    if (error) throw new Error(error.message)
    setProfile(data as Profile)
  }, [authUserId])

  const saveOnboarding = useCallback(async (role: AppRole, interests: string[], roleFocus: string[]) => {
    if (!authUserId) throw new Error('Sign in before saving onboarding preferences.')
    const client = getClient()
    const { error: roleError } = await client.from('user_roles').upsert(
      { user_id: authUserId, role, status: 'active' },
      { onConflict: 'user_id,role' },
    )
    if (roleError) throw new Error(roleError.message)
    const { error: preferenceError } = await client.from('user_preferences').upsert({
      user_id: authUserId,
      interests,
      role_focus: roleFocus,
      onboarding_completed: true,
    })
    if (preferenceError) throw new Error(preferenceError.message)
    setRoles(current => current.includes(role) ? current : [...current, role])
    setOnboardingCompleted(true)
  }, [authUserId])

  const createOrganization = useCallback(async (name: string, organizationType: string) => {
    if (!authUserId) throw new Error('Sign in before creating an organization.')
    const client = getClient()
    const normalizedName = name.trim()
    const { data: existing, error: lookupError } = await client
      .from('organizations')
      .select('id')
      .eq('owner_id', authUserId)
      .eq('name', normalizedName)
      .maybeSingle()
    if (lookupError) throw new Error(lookupError.message)
    if (existing) return
    const { error } = await client.from('organizations').insert({
      owner_id: authUserId,
      name: normalizedName,
      organization_type: organizationTypeSlug(organizationType),
    })
    if (error) throw new Error(error.message)
  }, [authUserId])

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(authUserId),
    profile,
    roles,
    onboardingCompleted,
    loading: !authReady || profileLoading,
    profileError,
    recoveryRequested,
    clearRecoveryRequest,
    signUp,
    signIn,
    signInWithOAuth,
    sendMagicLink,
    verifyOtp,
    resendOtp,
    requestPasswordReset,
    updatePassword,
    signOut,
    saveProfile,
    saveOnboarding,
    createOrganization,
  }), [
    authUserId,
    profile,
    roles,
    onboardingCompleted,
    authReady,
    profileLoading,
    profileError,
    recoveryRequested,
    clearRecoveryRequest,
    signUp,
    signIn,
    signInWithOAuth,
    sendMagicLink,
    verifyOtp,
    resendOtp,
    requestPasswordReset,
    updatePassword,
    signOut,
    saveProfile,
    saveOnboarding,
    createOrganization,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider.')
  return value
}
