# Supabase Integration Guide

This project uses Supabase as the database for storing API keys.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project or use an existing one
3. Note your project URL and anon key from Settings > API

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Create Database Table

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `supabase-schema.sql`:
   - This will create the `api_keys` table with all necessary columns
   - It includes indexes for better performance
   - Row Level Security (RLS) is enabled

### 5. Verify Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/dashboards`
3. The app will automatically seed dummy data if the table is empty

## Database Schema

The `api_keys` table includes:
- `id` (UUID, Primary Key)
- `name` (VARCHAR) - API key name
- `key` (TEXT) - The actual API key
- `description` (TEXT, Optional)
- `permissions` (TEXT[]) - Array of permissions
- `expires_at` (DATE, Optional)
- `created_at` (TIMESTAMP)
- `last_used` (TIMESTAMP, Optional)
- `is_active` (BOOLEAN)
- `usage` (INTEGER) - Current usage count
- `monthly_usage_limit` (INTEGER, Optional)

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Real-time data persistence
- ✅ Automatic key generation
- ✅ Usage tracking
- ✅ Last used timestamp updates
- ✅ Error handling with fallback to localStorage
- ✅ Loading states

## Troubleshooting

### Connection Issues

If you see errors about Supabase connection:
1. Verify your `.env.local` file has correct credentials
2. Check that your Supabase project is active
3. Ensure the `api_keys` table exists in your database

### Data Not Loading

1. Check browser console for errors
2. Verify RLS policies allow operations
3. The app will fallback to localStorage if Supabase fails

### Migration from localStorage

If you have existing data in localStorage:
1. The app will automatically migrate to Supabase on first load
2. Old localStorage data will be preserved as fallback
