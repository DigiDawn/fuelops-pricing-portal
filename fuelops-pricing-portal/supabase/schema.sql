create extension if not exists pgcrypto;
do $$ begin create type public.user_role as enum ('student','teacher','admin'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(course_id,student_id)
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,email,full_name) values(new.id,coalesce(new.email,''),new.raw_user_meta_data->>'full_name') on conflict(id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.profiles where id=auth.uid() and role='admin')$$;
create or replace function public.is_teacher() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.profiles where id=auth.uid() and role='teacher')$$;

alter table public.profiles enable row level security; alter table public.courses enable row level security; alter table public.enrollments enable row level security;

drop policy if exists "profiles select own or admin" on public.profiles;
create policy "profiles select own or admin" on public.profiles for select using(id=auth.uid() or public.is_admin());
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());

drop policy if exists "courses select" on public.courses;
create policy "courses select" on public.courses for select using(public.is_admin() or teacher_id=auth.uid() or exists(select 1 from public.enrollments e where e.course_id=courses.id and e.student_id=auth.uid()));
drop policy if exists "courses insert teacher" on public.courses;
create policy "courses insert teacher" on public.courses for insert with check(teacher_id=auth.uid() and public.is_teacher());
drop policy if exists "courses update" on public.courses;
create policy "courses update" on public.courses for update using(teacher_id=auth.uid() or public.is_admin()) with check(teacher_id=auth.uid() or public.is_admin());
drop policy if exists "courses delete" on public.courses;
create policy "courses delete" on public.courses for delete using(teacher_id=auth.uid() or public.is_admin());

drop policy if exists "enrollments select" on public.enrollments;
create policy "enrollments select" on public.enrollments for select using(student_id=auth.uid() or public.is_admin() or exists(select 1 from public.courses c where c.id=enrollments.course_id and c.teacher_id=auth.uid()));
drop policy if exists "enrollments admin manage" on public.enrollments;
create policy "enrollments admin manage" on public.enrollments for all using(public.is_admin()) with check(public.is_admin());

create index if not exists courses_teacher_idx on public.courses(teacher_id);
create index if not exists enrollments_student_idx on public.enrollments(student_id);
create index if not exists enrollments_course_idx on public.enrollments(course_id);
