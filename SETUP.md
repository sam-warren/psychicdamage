# Psychic Damage - Setup Guide

This guide will help you set up Psychic Damage locally for development or self-hosting.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account
- Git

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd psychicdamage
npm install
```

## 2. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Go to Settings > API to get your project URL and anon key

### Set up the Database

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the entire contents of `db_init.sql` in this repository
3. Paste it into the SQL Editor and run it
4. This will create all necessary tables, indexes, RLS policies, and trigger functions

### Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the following settings:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/dashboard`
   - **Email confirmation**: Enable if desired
   - **Password requirements**: Set as needed

## 3. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Next.js Configuration (Required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Optional: For AI features (Phase 6 - can be added later)
# OPENAI_API_KEY=your_openai_api_key

# Optional: For payments (Phase 9 - can be added later)
# STRIPE_SECRET_KEY=your_stripe_secret_key
# STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### How to get your Supabase credentials:

1. **Project URL**: In your Supabase dashboard, go to Settings > API. Copy the "Project URL"
2. **Anon Key**: In the same page, copy the "anon/public" key under "Project API keys"

### Generate NextAuth Secret:

```bash
openssl rand -base64 32
```

## 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 5. Test the Setup

1. **Create an Account**: Go to `/signup` and create a test account
2. **Check Database**: Verify that a profile was automatically created in Supabase
3. **Create a Campaign**: Test the campaign creation functionality
4. **Navigation**: Ensure the sidebar navigation works correctly

## 6. Phase 1 Features Completed

✅ **Authentication System**
- Email/password login and registration
- Password reset functionality
- Protected routes with middleware
- Automatic profile creation

✅ **Dashboard & Navigation**
- Responsive sidebar with theme toggle
- User profile dropdown
- Dashboard with campaign overview

✅ **Campaign Management**
- Create, edit, and delete campaigns
- Campaign list with search/filter
- Campaign details pages

✅ **UI Foundation**
- Dark/light mode support
- Consistent design system with shadcn/ui
- Responsive layouts for mobile/tablet/desktop
- Loading states and error handling

## Next Steps

After completing Phase 1 setup, you can proceed with:

- **Phase 2**: Player Management & Monster Database
- **Phase 3**: Encounter Builder
- **Phase 4**: Combat Tracker
- And so on...

## Troubleshooting

### Common Issues

**1. "Invalid API key" error**
- Double-check your Supabase URL and anon key in `.env.local`
- Ensure there are no extra spaces or quotes

**2. Database connection issues**
- Verify the SQL from `db_init.sql` was run successfully
- Check that RLS policies are enabled
- Ensure your Supabase project is fully initialized

**3. Authentication not working**
- Check that email confirmation is properly configured
- Verify redirect URLs in Supabase Auth settings
- Clear browser cache and cookies

**4. Middleware redirect loops**
- Ensure your `NEXTAUTH_URL` matches your development URL
- Check that the middleware.ts file is in the root directory

### Getting Help

1. Check the browser console for error messages
2. Review the Supabase dashboard logs
3. Verify all environment variables are set correctly
4. Ensure Node.js version is 18 or higher

## Development Notes

- The app uses Next.js 15 with the App Router
- All components are built with TypeScript and shadcn/ui
- Database operations use Supabase's JavaScript client
- Authentication is handled through Supabase Auth
- Form validation uses react-hook-form with Zod schemas

## Security Notes

- RLS (Row Level Security) is enabled on all user data tables
- Users can only access their own campaigns and related data
- Authentication is handled securely through Supabase
- Environment variables keep sensitive data secure 