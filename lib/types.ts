export interface Session {
  id: string;
  code: string;
  dm_token: string;
  created_at: string;
  expires_at: string;
  round: number;
  current_turn_index: number;
  is_active: boolean;
}

export interface Combatant {
  id: string;
  session_id: string;
  name: string;
  initiative: number;
  max_hp?: number;
  current_hp?: number;
  is_player: boolean;
  player_token?: string; // For player self-service
  
  // Action Economy
  action_available: boolean;
  bonus_action_available: boolean;
  reaction_available: boolean;
  movement_available: boolean;
  
  // Custom actions (for legendary actions, etc.)
  custom_actions: CustomAction[];
  
  // Optional fields
  notes?: string;
  conditions?: string[];
  
  created_at: string;
  order_index: number;
}

export interface CustomAction {
  id: string;
  name: string;
  max_uses: number;
  current_uses: number;
  reset_on: 'turn' | 'round' | 'manual';
}

export type UserRole = 'dm' | 'player';

export interface SessionMember {
  id: string;
  session_id: string;
  role: UserRole;
  token: string;
  combatant_id?: string; // Links player to their character
  connected_at: string;
}

// Real-time event types
// Note: Primary real-time sync is handled via Supabase Realtime (database changes)
// These event types are for potential future custom events if needed
export interface SessionEvent {
  type: 'combatant_added' | 'combatant_removed' | 'combatant_updated' | 
        'turn_advanced' | 'round_advanced' | 'action_used' | 'action_reset' |
        'session_ended' | 'member_joined' | 'member_left';
  session_id: string;
  data: Combatant | { turn_index: number } | { round: number } | { member: SessionMember } | Record<string, unknown>;
  timestamp: string;
}

// UI State types
export interface SessionState {
  session: Session | null;
  combatants: Combatant[];
  currentMember: SessionMember | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

// Form types
export interface CreateSessionData {
  playerName?: string; // DM can optionally add themselves as a combatant
}

export interface JoinSessionData {
  code: string;
  playerName?: string;
}

export interface AddCombatantData {
  name: string;
  initiative: number;
  maxHp?: number;
  currentHp?: number;
  isPlayer: boolean;
  customActions?: Omit<CustomAction, 'id'>[];
} 