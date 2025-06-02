# Psychic Damage - Setup Guide

## Phase 1 Complete! 🎉

Congratulations! Phase 1 of the Psychic Damage D&D combat tracker is now complete. You have a working session management system with the following features:

✅ **Session Creation & Joining**
- DMs can create new sessions with unique 6-character codes
- Players can join sessions without accounts
- Automatic role assignment (DM vs Player)
- 24-hour session expiration

✅ **Basic UI**
- Beautiful landing page with feature highlights
- Session management interface
- Mobile-responsive design
- Toast notifications for user feedback

## Required Setup

To get your combat tracker running, you'll need to set up Supabase as your backend.

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be fully provisioned

### 2. Set Up the Database

1. In your Supabase dashboard, go to the **SQL Editor**
2. Create a new query and paste the contents of `supabase-schema.sql`
3. Run the query to create the required tables and policies

### 3. Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To find these values:
1. Go to your Supabase project dashboard
2. Click on **Settings** → **API**
3. Copy the **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
4. Copy the **anon public** key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 4. Run the Application

```bash
npm run dev
```

Your combat tracker will be available at `http://localhost:3000`

## How to Test Phase 1

1. **Create a Session**:
   - Visit the landing page
   - Click "Create Session"
   - You should be redirected to a session page with a 6-character code

2. **Join a Session**:
   - Open another browser/incognito window
   - Enter the session code from step 1
   - You should join the session as a player

3. **Verify Features**:
   - Session code copying works
   - Role badges display correctly (DM vs Player)
   - Session information is displayed
   - Back navigation works

## What's Next? (Phase 2 & 3)

Phase 1 provides the foundation. Here's what's coming next:

### Phase 2: Real-Time Infrastructure
- Supabase Realtime for live database synchronization
- Real-time session and combatant updates
- Connection state management
- Auto-reconnection handling

### Phase 3: Combat Tracker Core
- Initiative tracking and management
- Add/remove combatants
- Turn advancement system
- Round counter

### Phase 4: Action Economy Tracking
- Action/Bonus Action/Reaction toggles
- Visual action state indicators
- Turn-based action resets
- Player self-service action tracking

### Phase 5: UI/UX Polish
- Enhanced visual design
- Better mobile experience
- Accessibility improvements
- Loading states and animations

## Architecture Overview

The current Phase 1 implementation includes:

- **`lib/types.ts`**: TypeScript interfaces for sessions, combatants, and events
- **`lib/supabase.ts`**: Supabase client configuration and database types
- **`lib/session.ts`**: Session management utilities (create, join, manage)
- **`hooks/use-session.ts`**: React hook for session state management
- **`hooks/use-realtime.ts`**: Supabase Realtime hook (expanded in Phase 2)
- **`app/page.tsx`**: Landing page with session creation/joining
- **`app/session/[code]/page.tsx`**: Session interface (placeholder for combat tracker)

## Contributing

The project follows Next.js 15 conventions with:
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for components
- **Supabase for backend and real-time database synchronization**
- File-based routing

Each phase builds incrementally on the previous one, ensuring the app remains functional at every step.

## Real-Time Architecture

**Why Supabase Realtime?**

We use Supabase Realtime instead of custom WebSockets because:

✅ **Database-Driven**: All our real-time events are database changes (adding combatants, updating actions, advancing turns)  
✅ **Automatic Management**: Connection handling, reconnection, and authentication are built-in  
✅ **Perfect Fit**: When data changes in PostgreSQL, all connected clients are instantly notified  
✅ **No Custom Infrastructure**: No need to manage WebSocket servers, rooms, or message routing  
✅ **Scalable**: Handles multiple sessions and users automatically  

This means when a DM adds a combatant or a player marks an action as used, it's instantly synchronized across all devices without any custom real-time code.

## Troubleshooting

### "Missing Supabase environment variables" error
- Ensure your `.env.local` file is in the project root
- Check that variable names match exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your development server after adding environment variables

### Session creation fails
- Verify the database schema was applied correctly in Supabase
- Check the Supabase logs in your dashboard for any database errors
- Ensure Row Level Security policies are set up correctly

### Can't join sessions
- Verify sessions are being created (check the `sessions` table in Supabase)
- Ensure the session code is entered correctly (case-sensitive)
- Check that the session hasn't expired (24-hour limit)

Ready to implement Phase 2? Check the TODO.md for the next set of features to build! 