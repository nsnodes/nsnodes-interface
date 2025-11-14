# Database Migrations

## How to Apply the Kids Submissions Migration

The `/nskids` page requires a database table to store submissions. Follow these steps:

### Option 1: Supabase Dashboard (Easiest)

1. Go to your Supabase project: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `create_kids_submissions.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Cmd+Enter`
7. You should see: "Success. No rows returned"

### Option 2: Supabase CLI

```bash
# Make sure you're linked to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push
```

### Option 3: psql Direct Connection

```bash
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" -f supabase/migrations/create_kids_submissions.sql
```

## Verify Migration

After running the migration, verify it worked:

1. In Supabase Dashboard → **Table Editor**
2. You should see a new table: `kids_submissions`
3. It should have columns: id, start_date, end_date, kid1_age, kid2_age, kid3_age, kid4_age, parent1_discord, parent2_discord, created_at

## Troubleshooting

**Error: "relation already exists"**
- The table is already created, you're good to go!

**Error: "permission denied"**
- Make sure you're using the correct database credentials
- Use the service role key or postgres password

**Error: "database table not found" in app**
- The migration hasn't been run yet
- Follow the steps above to create the table
