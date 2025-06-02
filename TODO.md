# D&D 5e Combat Tracker - Development TODO

## Project Overview
**Vision:** A lightweight, web-based D&D combat tracker focusing on action economy management and initiative tracking, with real-time multiplayer sync and no login requirements.

**Core Philosophy:** 
- Encourage physical dice rolls (don't replace them)
- Minimal setup overhead
- Ephemeral sessions (no persistent data storage needed)
- Action economy clarity above all else

---

## Technical Architecture

### Tech Stack Decisions
- [ ] **Frontend:** Next.js 14+ with React
- [ ] **Real-time Sync:** Choose between:
  - [ ] Supabase (Database + Realtime + Auth ready)
  - [ ] Socket.IO + Redis for session state
- [ ] **UI Framework:** Tailwind CSS + shadcn/ui or Mantine
- [ ] **State Management:** React Context + useReducer (avoid Redux for MVP)
- [ ] **Deployment:** Vercel (seamless Next.js integration)

### Project Structure Setup
```
src/
├── app/
│   ├── page.tsx (landing/create session)
│   ├── join/page.tsx
│   ├── session/[code]/page.tsx
│   └── api/
├── components/
│   ├── ui/ (base components)
│   ├── CombatantCard.tsx
│   ├── InitiativeTracker.tsx
│   ├── ControlsBar.tsx
│   └── AddCombatantForm.tsx
├── lib/
│   ├── session.ts
│   ├── realtime.ts
│   └── types.ts
└── hooks/
    ├── useSession.ts
    └── useRealtime.ts
```

---

## MVP Features (v1.0) - Priority Order

### 🚀 Phase 1: Core Session Management
- [ ] **Session Creation** 
  - [ ] Generate unique 6-character session codes
  - [ ] Create session API endpoint
  - [ ] DM access token generation
  - [ ] Session expiration logic (24h auto-cleanup)

- [ ] **Session Joining**
  - [ ] Join via session code input
  - [ ] Join via direct link sharing
  - [ ] Role assignment (DM vs Player)
  - [ ] No login/signup required

- [ ] **Basic UI Setup**
  - [ ] Landing page with "Create Session" button
  - [ ] Join session page
  - [ ] Session not found error handling
  - [ ] Mobile-responsive base layout

### 🚀 Phase 2: Real-Time Infrastructure
- [ ] **Real-Time Communication**
  - [ ] Set up WebSocket connection
  - [ ] Session room/channel management
  - [ ] Event broadcasting system
  - [ ] Connection state management
  - [ ] Reconnection handling

- [ ] **State Synchronization**
  - [ ] Session state schema design
  - [ ] Real-time state updates
  - [ ] Conflict resolution (DM has priority)
  - [ ] Client-side state caching

### 🚀 Phase 3: Combat Tracker Core
- [ ] **Initiative Management**
  - [ ] Add combatants form (name, initiative value)
  - [ ] Initiative order sorting/display
  - [ ] Current turn highlighting
  - [ ] Round counter (prominently displayed)
  - [ ] Next/Previous turn controls (DM only)

- [ ] **Combatant Management**
  - [ ] Add PC/NPC quickly (name + initiative)
  - [ ] Remove combatants
  - [ ] Reorder initiative mid-combat
  - [ ] Basic HP tracking (optional, manual entry)

### 🚀 Phase 4: Action Economy Tracking
- [ ] **Action Types Implementation**
  - [ ] Action, Bonus Action, Reaction, Movement toggles
  - [ ] Visual states (available/used/disabled)
  - [ ] Per-combatant action management
  - [ ] Custom action counts (legendary actions, etc.)

- [ ] **Turn-Based Resets**
  - [ ] Auto-reset Action/Bonus/Movement on new turn
  - [ ] Reset Reactions at end of round
  - [ ] Custom reset logic for special cases
  - [ ] Manual action reset override

- [ ] **Player Self-Service**
  - [ ] Players can toggle their own actions
  - [ ] Real-time action updates for all clients
  - [ ] Permission system (players only edit their character)
  - [ ] Clear visual feedback for action state changes

### 🚀 Phase 5: UI/UX Polish
- [ ] **Visual Design**
  - [ ] Clean, minimal interface
  - [ ] Clear action state indicators (icons/colors)
  - [ ] Turn highlight animations
  - [ ] Loading states and error handling

- [ ] **Responsive Design**
  - [ ] Desktop layout optimization
  - [ ] Tablet view adjustments
  - [ ] Mobile-first initiative list
  - [ ] Touch-friendly action buttons

- [ ] **Accessibility**
  - [ ] Screen reader compatibility
  - [ ] Color-blind friendly design
  - [ ] Keyboard navigation
  - [ ] High contrast mode option

---

## Key Pain Points to Address

### 🎯 Explicit Solutions to Competitor Issues
- [ ] **No Hidden Information**
  - [ ] Round counter always visible (vs Improved Initiative)
  - [ ] Turn controls prominent (vs buried menus)
  - [ ] Action states clearly displayed

- [ ] **True Cross-Platform Sync**
  - [ ] No device-tied data (vs Hero Muster/Improved Initiative)
  - [ ] Instant state updates across all clients
  - [ ] Session accessible from any device

- [ ] **Player Engagement**
  - [ ] Interactive player roles (vs passive viewing)
  - [ ] Self-service action tracking
  - [ ] Reduced DM micromanagement

- [ ] **Setup Speed**
  - [ ] Add combatant in <5 seconds
  - [ ] No complex monster database required
  - [ ] Default action economy (1 Action, 1 Bonus, 1 Reaction)

### 🚫 Scope Creep Prevention
- [ ] **Avoid Over-Automation**
  - [ ] No damage calculation enforcement
  - [ ] No rules validation (trust players)
  - [ ] Manual HP adjustments only

- [ ] **Stay Lightweight**
  - [ ] No dice rolling (encourage physical dice)
  - [ ] No character sheets/builder
  - [ ] No maps or battle grid
  - [ ] No extensive monster database

---

## Post-MVP Features (v1.1+)

### 🔄 Quality of Life Improvements
- [ ] **Enhanced Turn Management**
  - [ ] Undo last turn advancement
  - [ ] Delay initiative option
  - [ ] Insert combatants mid-combat
  - [ ] Pause/resume combat

- [ ] **Condition Tracking**
  - [ ] Simple status tags (stunned, prone, etc.)
  - [ ] Custom condition notes
  - [ ] Condition duration tracking
  - [ ] Visual condition indicators

### 🔧 Advanced Features
- [ ] **User Accounts (Optional)**
  - [ ] Save frequently used NPCs
  - [ ] Session history/templates
  - [ ] Cross-session preferences

- [ ] **Integrations**
  - [ ] D&D Beyond character import (API)
  - [ ] SRD monster quick-add
  - [ ] Export session log

- [ ] **Enhanced UX**
  - [ ] Drag-and-drop reordering
  - [ ] Custom themes/dark mode
  - [ ] Sound notifications
  - [ ] PWA offline capability

---

## Success Metrics & User Feedback Focus

### 📊 Key Performance Indicators
- [ ] **Setup Speed:** Combatant added in <5 seconds
- [ ] **Action Clarity:** Players know action state at a glance
- [ ] **Cross-Platform:** Works smoothly on phone, tablet, desktop
- [ ] **Real-Time Performance:** <100ms action state updates

### 🎯 User Research Areas
- [ ] Test with actual D&D groups
- [ ] Measure setup time vs pen-and-paper
- [ ] Validate action economy tracking value
- [ ] Assess mobile usability in play

---

## Development Milestones

### Week 1-2: Foundation
- [ ] Next.js project setup
- [ ] Basic routing and pages
- [ ] Session creation/joining flow
- [ ] Real-time connection setup

### Week 3-4: Core Functionality  
- [ ] Initiative tracker implementation
- [ ] Turn management system
- [ ] Basic combatant management
- [ ] Action economy tracking

### Week 5-6: Polish & Testing
- [ ] UI/UX refinements
- [ ] Mobile responsiveness
- [ ] Real-world testing with D&D groups
- [ ] Performance optimization

### Week 7-8: Launch Preparation
- [ ] Bug fixes and edge cases
- [ ] Deployment setup
- [ ] Basic documentation
- [ ] Community feedback integration

---

## Notes

**Design Principles:**
1. **Clarity over Complexity:** If it's not clear at a glance, redesign it
2. **Speed over Features:** Fast setup beats comprehensive data
3. **Collaboration over Control:** Empower players, don't gate everything behind DM
4. **Complement, Don't Replace:** Work alongside existing tools and dice

**Anti-Patterns to Avoid:**
- Requiring extensive setup before play
- Hiding essential information in menus
- Making players passive observers
- Over-automating D&D rules
- Creating yet another VTT/character sheet tool 