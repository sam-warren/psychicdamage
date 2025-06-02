import { createClient } from '@supabase/supabase-js';
import { CustomAction } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database type definitions for Supabase
export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          code: string;
          dm_token: string;
          created_at: string;
          expires_at: string;
          round: number;
          current_turn_index: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          code: string;
          dm_token: string;
          created_at?: string;
          expires_at: string;
          round?: number;
          current_turn_index?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          code?: string;
          dm_token?: string;
          created_at?: string;
          expires_at?: string;
          round?: number;
          current_turn_index?: number;
          is_active?: boolean;
        };
      };
      combatants: {
        Row: {
          id: string;
          session_id: string;
          name: string;
          initiative: number;
          max_hp: number | null;
          current_hp: number | null;
          is_player: boolean;
          player_token: string | null;
          action_available: boolean;
          bonus_action_available: boolean;
          reaction_available: boolean;
          movement_available: boolean;
          custom_actions: CustomAction[]; // JSON field
          notes: string | null;
          conditions: string[] | null;
          created_at: string;
          order_index: number;
        };
        Insert: {
          id?: string;
          session_id: string;
          name: string;
          initiative: number;
          max_hp?: number | null;
          current_hp?: number | null;
          is_player?: boolean;
          player_token?: string | null;
          action_available?: boolean;
          bonus_action_available?: boolean;
          reaction_available?: boolean;
          movement_available?: boolean;
          custom_actions?: CustomAction[];
          notes?: string | null;
          conditions?: string[] | null;
          created_at?: string;
          order_index?: number;
        };
        Update: {
          id?: string;
          session_id?: string;
          name?: string;
          initiative?: number;
          max_hp?: number | null;
          current_hp?: number | null;
          is_player?: boolean;
          player_token?: string | null;
          action_available?: boolean;
          bonus_action_available?: boolean;
          reaction_available?: boolean;
          movement_available?: boolean;
          custom_actions?: CustomAction[];
          notes?: string | null;
          conditions?: string[] | null;
          created_at?: string;
          order_index?: number;
        };
      };
    };
  };
} 