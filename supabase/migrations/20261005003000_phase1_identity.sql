create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  username text,
  bio text not null default '',
  country text not null default '',
  city text not null default '',
  website text not null default '',
  social_links jsonb not null default '{}'::jsonb check (jsonb_typeof(social_links) = 'object'),
  preferred_language text not null default 'en',
  timezone text not null default 'UTC+3 Nairobi',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (
    username is null or username ~ '^[a-z0-9_]{3,30}$'
  )
);

create unique index profiles_username_lower_unique
  on public.profiles (lower(username))
  where username is not null;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('viewer', 'creator', 'organization', 'student', 'educator')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_roles_user_role_unique unique (user_id, role)
);

create index user_roles_user_id_idx on public.user_roles (user_id);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (length(trim(name)) between 2 and 160),
  organization_type text not null check (
    organization_type in (
      'production_studio',
      'educational_institution',
      'broadcaster',
      'government_cultural',
      'brand_advertiser',
      'ngo_nonprofit',
      'events_festivals',
      'distributor',
      'other'
    )
  ),
  status text not null default 'active' check (
    status in ('active', 'pending_verification', 'suspended', 'archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index organizations_owner_id_idx on public.organizations (owner_id);
create unique index organizations_owner_name_unique
  on public.organizations (owner_id, lower(name))
  where status <> 'archived';

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  status text not null default 'active' check (status in ('pending', 'active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_members_org_user_unique unique (organization_id, user_id)
);

create index organization_members_user_id_idx on public.organization_members (user_id);
create index organization_members_org_role_idx
  on public.organization_members (organization_id, role, status);

create table public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  interests text[] not null default '{}',
  role_focus text[] not null default '{}',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_phase1_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_phase1_updated_at();

create trigger user_roles_set_updated_at
before update on public.user_roles
for each row execute function public.set_phase1_updated_at();

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_phase1_updated_at();

create trigger organization_members_set_updated_at
before update on public.organization_members
for each row execute function public.set_phase1_updated_at();

create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row execute function public.set_phase1_updated_at();

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), ''),
    nullif(lower(trim(both '@' from new.raw_user_meta_data ->> 'username')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.create_profile_for_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row execute function public.create_profile_for_auth_user();

create or replace function public.create_organization_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.owner_id is distinct from auth.uid() then
    raise exception 'Organization owner must be the authenticated user';
  end if;

  insert into public.organization_members (organization_id, user_id, role, status)
  values (new.id, new.owner_id, 'owner', 'active');
  return new;
end;
$$;

revoke all on function public.create_organization_owner_membership() from public, anon, authenticated;

create trigger organizations_create_owner_membership
after insert on public.organizations
for each row execute function public.create_organization_owner_membership();

create or replace function public.is_organization_admin(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members as membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
      and membership.role in ('owner', 'admin')
      and membership.status = 'active'
  );
$$;

revoke all on function public.is_organization_admin(uuid) from public, anon;
grant execute on function public.is_organization_admin(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.user_preferences enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (id = (select auth.uid()));

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "Users can read their own roles"
on public.user_roles for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Users can assign themselves supported roles"
on public.user_roles for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and role in ('viewer', 'creator', 'organization', 'student', 'educator')
  and status = 'active'
);

create policy "Users can update their own supported roles"
on public.user_roles for update
to authenticated
using (
  user_id = (select auth.uid())
  and role in ('viewer', 'creator', 'organization', 'student', 'educator')
)
with check (
  user_id = (select auth.uid())
  and role in ('viewer', 'creator', 'organization', 'student', 'educator')
);

create policy "Users can remove their own supported roles"
on public.user_roles for delete
to authenticated
using (
  user_id = (select auth.uid())
  and role in ('viewer', 'creator', 'organization', 'student', 'educator')
);

create policy "Organization members can read their organizations"
on public.organizations for select
to authenticated
using (
  owner_id = (select auth.uid())
  or public.is_organization_admin(id)
  or exists (
    select 1
    from public.organization_members as membership
    where membership.organization_id = id
      and membership.user_id = (select auth.uid())
      and membership.status = 'active'
  )
);

create policy "Users can create organizations they own"
on public.organizations for insert
to authenticated
with check (owner_id = (select auth.uid()) and status = 'active');

create policy "Owners can update their organizations"
on public.organizations for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "Organization members and admins can read memberships"
on public.organization_members for select
to authenticated
using (
  user_id = (select auth.uid())
  or public.is_organization_admin(organization_id)
);

create policy "Organization admins can add non-owner members"
on public.organization_members for insert
to authenticated
with check (
  public.is_organization_admin(organization_id)
  and role in ('admin', 'member')
);

create policy "Organization admins can remove non-owner members"
on public.organization_members for delete
to authenticated
using (
  public.is_organization_admin(organization_id)
  and role in ('admin', 'member')
);

create policy "Users can read their own preferences"
on public.user_preferences for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Users can create their own preferences"
on public.user_preferences for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "Users can update their own preferences"
on public.user_preferences for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant select, insert, update on public.organizations to authenticated;
grant select, insert, delete on public.organization_members to authenticated;
grant select, insert, update on public.user_preferences to authenticated;
