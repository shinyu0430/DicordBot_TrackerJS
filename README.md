# DicordBot_TrackerJS

## Introduction

## Discord Dev Portal

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) and register your bot.
2. Don't forget to checkout your permissions in `Bot/Privileged Gateway Intents` if you needed
3. Copy .env_template as .env <br>
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
     public.tasks (
       id uuid not null default gen_random_uuid (),
       user_id text null default ''::text,
       task_name text null default ''::text,
       created_at timestamp with time zone null default now(),
       done boolean null default false,
       guild_id text null default ''::text,
       constraint tasks_pkey primary key (id)
     ) tablespace pg_default;

    create table
    public.group (
      id uuid not null default gen_random_uuid (),
      group_name text null default ''::text,
      constraint group_pkey primary key (id)
    ) tablespace pg_default;

    create table
    public.group_user (
      joined_at timestamp with time zone null default (now() at time zone 'utc+8'::text),
      user_id text not null,
      group_id uuid not null,
      constraint group_user_pkey primary key (group_id, user_id),
      constraint group_user_group_id_fkey foreign key (group_id) references "group" (id) on delete cascade
    ) tablespace pg_default;
    create table
    public.guild_group (
      id uuid not null default gen_random_uuid (),
      guild_id text null,
      group_id uuid null,
      constraint guild_group_pkey primary key (id),
      constraint guild_group_group_id_fkey foreign key (group_id) references "group" (id) on delete cascade
    ) tablespace pg_default;

    create table
    public.track (
      guild_id text not null,
      execute boolean not null,
      channel_id text null,
      constraint track_pkey primary key (guild_id)
    ) tablespace pg_default;

    create table
    public.track_user (
      guild_id text not null,
      account_id text not null,
      constraint track_user_pkey primary key (guild_id, account_id)
    ) tablespace pg_default;
   ```


2. Paste your `supabase url` and `supabase api key` into `.env`

## Usage
### Install package

```
npm install
```
### Run the app

```
npm run start
```

## Discord Command

### Group: To assign tasks on a group basis.

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

### Task: Record the completion of weekly tasks.

**New**
![](https://imgur.com/fZ4C3I4l.gif)
```
!task-new
<task1>
<task2>
...
```

**Done**
![](https://imgur.com/7dciWwJl.gif)
```
!task-done <index-1> <index-2>...
...
```

**Undone**

```
!task-undone <index-1> <index-2>...
...
```

**Delete**

```
!task-del <index-1> <index-2>...
...
```


### Track: Track daily submission records on LeetCode.
**Setting leetcode daily tracking**
Start tracking. Default notifications will be sent to the text channel where you issued the command. Provide a channel ID to choose a different text channel for notifications.
```
!track-setting on <Channel id(optional)>
```
Stop tracking.
```
!track-setting off
```

**Join leetcode daily tracking**
```
!track-join <Leetcode id>
```
**Leave leetcode daily tracking**

```
!track-leave <Leetcode id>
```

### Other
Provide command reminders when you forget it.
```
!help
```