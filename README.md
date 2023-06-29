# DicordBot_TrackerJS

## Introduction

## Discord Dev Portal

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) and register your bot.
2. Don't forget to checkout your permissions in `Bot/Privileged Gateway Intents` if you needed
3. 
In Windows:
```
copy .env_template .env
```
In Linux/Mac:
```
cp .env_template .env
```
4. Paste your `TOKEN` in `Bot/` into `.env`
5. Invite the bot into your server via `OAuth2/URL Generator`

## Supabase - Table definition

### Reminder

Currently change at 2023/6/29 15:33 UTF+8

### Steps

1. Setup your environment
   
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

2. Paste your `supabase url` and `supabase api key` into `.env`

## Usage

### Run the app

```
npm run start
```

### Group

**Join the group**

```
!group-join <group-name>
```

**Leave the group**

```
!group-leave <group-name>
```

**Assign Group Task**

```
!group-assign <group-name>
<task1>
<task2>
...
```

### Task

**New**

```
!task-new
<task1>
<task2>
...
```

**Delete**

```
!task-del <index-1> <index-2>...
...
```

**Done**

```
!task-done <index-1> <index-2>...
...
```

**Undone**

```
!task-undone <index-1> <index-2>...
...
```

**Archive: You CANNOT unarchived, use this command carefully**

```
!task-archive <index-1> <index-2>...
...
```
