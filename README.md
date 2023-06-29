# DicordBot_TrackerJS

## Table definition

Currently change at 2023/6/29 15:33 UTF+8

```
create table
  public.archived (
    id uuid not null default gen_random_uuid (),
    archived_at timestamp with time zone null default now(),
    user_id text null default ''::text,
    task_name text null default ''::text,
    done boolean null default false,
    guild_id text null default ''::text,
    constraint archived_pkey primary key (id)
  ) tablespace pg_default;
create table
  public.group (
    id uuid not null default gen_random_uuid (),
    group_name text null default ''::text,
    user_id text null default ''::text,
    join_at timestamp with time zone null default now(),
    guild_id text null default ''::text,
    constraint group_pkey primary key (id)
  ) tablespace pg_default;
create table
  public.tasks (
    id uuid not null default gen_random_uuid (),
    user_id text null default ''::text,
    task_name text null default ''::text,
    created_at timestamp with time zone null default now(),
    done boolean null default false,
    guild_id text null default ''::text,
    constraint tasks_pkey primary key (id)
  ) tablespace pg_default;
```
