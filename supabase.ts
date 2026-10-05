import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const authStorage = new Map<string, string>()
const volatileStorage = {
  getItem: (key: string) => authStorage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    authStorage.set(key, value)
  },
  removeItem: (key: string) => {
    authStorage.delete(key)
  },
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          storage: volatileStorage,
        },
      })
    : null
