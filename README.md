# Psychic Damage 🎲

A lightning-fast D&D 5e combat tracker focused on action economy and initiative management. Built to complement your physical dice, not replace them.

![Phase 1 Complete](https://img.shields.io/badge/Phase%201-Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green)

## ✨ Features (Phase 1 Complete)

- **🚀 Lightning Setup**: Create sessions in seconds, no accounts required
- **🔗 Easy Sharing**: 6-character session codes for instant player joining  
- **👥 Role-Based Access**: Automatic DM/Player role assignment
- **📱 Cross-Platform**: Works seamlessly on desktop, tablet, and mobile
- **⏰ Auto-Cleanup**: Sessions expire after 24 hours

## 🎯 What Makes This Different

**Fills Market Gaps:**
- **Explicit Action Economy Tracking**: Visual indicators for Action, Bonus Action, Reaction, Movement
- **True Real-Time Collaboration**: Players manage their own actions, reducing DM workload
- **Zero Friction Setup**: No logins, no complex forms, add combatants in <5 seconds
- **Dice-Friendly**: Encourages physical dice rolls while organizing the chaos

**Addresses Pain Points from Existing Tools:**
- D&D Beyond: Limited functionality, expensive, requires accounts
- Improved Initiative: Cluttered UI, hidden controls, no real cross-platform sync
- Shieldmaiden: Heavyweight, complex setup for simple needs

## 🚧 Development Roadmap

### ✅ Phase 1: Core Session Management (Complete)
- Session creation and joining
- Role assignment and basic UI
- Mobile-responsive design

### ⏳ Phase 2: Real-Time Infrastructure
- Supabase Realtime for live database synchronization
- Real-time session and combatant updates
- Connection state management

### ⏳ Phase 3: Combat Tracker Core
- Initiative tracking and management
- Add/remove combatants quickly
- Turn advancement and round counter

### ⏳ Phase 4: Action Economy Tracking
- Action/Bonus Action/Reaction toggles
- Visual action state indicators
- Player self-service action tracking

### ⏳ Phase 5: UI/UX Polish
- Enhanced visual design
- Accessibility improvements
- Performance optimization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Realtime database sync)
- **Deployment**: Vercel

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd psychicdamage
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL from `supabase-schema.sql` in your SQL editor
   - Get your project URL and anon key

3. **Configure environment**
   ```bash
   # Create .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 📋 How to Test Phase 1

1. **Create a Session**: Click "Create Session" on the homepage
2. **Join a Session**: Open incognito window, enter the session code
3. **Verify Features**: Test session code copying, role badges, navigation

## 🎲 Philosophy

**Design Principles:**
1. **Clarity over Complexity**: If it's not clear at a glance, redesign it
2. **Speed over Features**: Fast setup beats comprehensive data entry
3. **Collaboration over Control**: Empower players, don't gate everything behind DM
4. **Complement, Don't Replace**: Work alongside existing tools and physical dice

**What We DON'T Build:**
- ❌ Dice rolling automation (use your physical dice!)
- ❌ Character sheets/builders (D&D Beyond does this well)
- ❌ Battle maps/VTT features (use Roll20, Foundry, etc.)
- ❌ Rules enforcement (trust your players)

## 📊 Market Research

Based on extensive research of existing tools like D&D Beyond, Improved Initiative, Shieldmaiden, and others, this project specifically targets the gaps:

- **Action Economy Tracking**: No mainstream tool explicitly tracks per-turn action usage
- **Real-Time Player Collaboration**: Most tools are DM-only with passive player views
- **Setup Speed**: Many tools require extensive prep or complex databases
- **Cross-Platform Sync**: Device-tied data is still common

See [research.md](./research.md) for full market analysis.

## 🤝 Contributing

This project is built incrementally with each phase being fully functional. Check [TODO.md](./TODO.md) for current development status and next steps.

## 📜 License

[MIT License](./LICENSE) - Feel free to use this for your own D&D groups!

---

**Built for DMs and players who want organized combat without losing the magic of rolling physical dice.** 🎲✨
