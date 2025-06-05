export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          settings: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          settings?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          settings?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      combat_log: {
        Row: {
          action_data: Json
          action_type: string
          created_at: string | null
          encounter_id: string | null
          id: string
          participant_id: string | null
          round_number: number | null
          turn_number: number | null
        }
        Insert: {
          action_data: Json
          action_type: string
          created_at?: string | null
          encounter_id?: string | null
          id?: string
          participant_id?: string | null
          round_number?: number | null
          turn_number?: number | null
        }
        Update: {
          action_data?: Json
          action_type?: string
          created_at?: string | null
          encounter_id?: string | null
          id?: string
          participant_id?: string | null
          round_number?: number | null
          turn_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "combat_log_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combat_log_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "encounter_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      encounter_participants: {
        Row: {
          armor_class: number | null
          conditions: Json | null
          created_at: string | null
          current_hp: number
          encounter_id: string | null
          id: string
          initiative: number | null
          initiative_bonus: number | null
          is_defeated: boolean | null
          max_hp: number
          monster_id: string | null
          name: string
          notes: string | null
          participant_type: string | null
          player_id: string | null
          turn_order: number | null
          updated_at: string | null
        }
        Insert: {
          armor_class?: number | null
          conditions?: Json | null
          created_at?: string | null
          current_hp: number
          encounter_id?: string | null
          id?: string
          initiative?: number | null
          initiative_bonus?: number | null
          is_defeated?: boolean | null
          max_hp: number
          monster_id?: string | null
          name: string
          notes?: string | null
          participant_type?: string | null
          player_id?: string | null
          turn_order?: number | null
          updated_at?: string | null
        }
        Update: {
          armor_class?: number | null
          conditions?: Json | null
          created_at?: string | null
          current_hp?: number
          encounter_id?: string | null
          id?: string
          initiative?: number | null
          initiative_bonus?: number | null
          is_defeated?: boolean | null
          max_hp?: number
          monster_id?: string | null
          name?: string
          notes?: string | null
          participant_type?: string | null
          player_id?: string | null
          turn_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "encounter_participants_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounter_participants_monster_id_fkey"
            columns: ["monster_id"]
            isOneToOne: false
            referencedRelation: "monsters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounter_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      encounters: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          current_round: number | null
          current_turn: number | null
          description: string | null
          difficulty: string | null
          environment: string | null
          id: string
          is_active: boolean | null
          loot_notes: string | null
          name: string
          player_visibility: Json | null
          share_token: string | null
          updated_at: string | null
          xp_budget: number | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          current_round?: number | null
          current_turn?: number | null
          description?: string | null
          difficulty?: string | null
          environment?: string | null
          id?: string
          is_active?: boolean | null
          loot_notes?: string | null
          name: string
          player_visibility?: Json | null
          share_token?: string | null
          updated_at?: string | null
          xp_budget?: number | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          current_round?: number | null
          current_turn?: number | null
          description?: string | null
          difficulty?: string | null
          environment?: string | null
          id?: string
          is_active?: boolean | null
          loot_notes?: string | null
          name?: string
          player_visibility?: Json | null
          share_token?: string | null
          updated_at?: string | null
          xp_budget?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "encounters_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      monsters: {
        Row: {
          ability_scores: Json | null
          actions: Json | null
          alignment: string | null
          armor_class: number | null
          challenge_rating: number | null
          condition_immunities: string[] | null
          created_at: string | null
          created_by: string | null
          damage_immunities: string[] | null
          damage_resistances: string[] | null
          hit_dice: string | null
          hit_points: number | null
          id: string
          is_homebrew: boolean | null
          languages: string | null
          legendary_actions: Json | null
          name: string
          senses: string | null
          size: string | null
          skills: Json | null
          source: string | null
          special_abilities: Json | null
          speed: Json | null
          subtype: string | null
          type: string | null
          xp: number | null
        }
        Insert: {
          ability_scores?: Json | null
          actions?: Json | null
          alignment?: string | null
          armor_class?: number | null
          challenge_rating?: number | null
          condition_immunities?: string[] | null
          created_at?: string | null
          created_by?: string | null
          damage_immunities?: string[] | null
          damage_resistances?: string[] | null
          hit_dice?: string | null
          hit_points?: number | null
          id?: string
          is_homebrew?: boolean | null
          languages?: string | null
          legendary_actions?: Json | null
          name: string
          senses?: string | null
          size?: string | null
          skills?: Json | null
          source?: string | null
          special_abilities?: Json | null
          speed?: Json | null
          subtype?: string | null
          type?: string | null
          xp?: number | null
        }
        Update: {
          ability_scores?: Json | null
          actions?: Json | null
          alignment?: string | null
          armor_class?: number | null
          challenge_rating?: number | null
          condition_immunities?: string[] | null
          created_at?: string | null
          created_by?: string | null
          damage_immunities?: string[] | null
          damage_resistances?: string[] | null
          hit_dice?: string | null
          hit_points?: number | null
          id?: string
          is_homebrew?: boolean | null
          languages?: string | null
          legendary_actions?: Json | null
          name?: string
          senses?: string | null
          size?: string | null
          skills?: Json | null
          source?: string | null
          special_abilities?: Json | null
          speed?: Json | null
          subtype?: string | null
          type?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "monsters_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          campaign_id: string | null
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          session_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          session_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          session_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      npcs: {
        Row: {
          avatar_url: string | null
          campaign_id: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          personality: string | null
          relationship: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          personality?: string | null
          relationship?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          campaign_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          personality?: string | null
          relationship?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "npcs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          ability_scores: Json | null
          ac: number
          campaign_id: string | null
          created_at: string | null
          current_hp: number
          id: string
          initiative_bonus: number | null
          level: number | null
          max_hp: number
          name: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          ability_scores?: Json | null
          ac?: number
          campaign_id?: string | null
          created_at?: string | null
          current_hp?: number
          id?: string
          initiative_bonus?: number | null
          level?: number | null
          max_hp?: number
          name: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          ability_scores?: Json | null
          ac?: number
          campaign_id?: string | null
          created_at?: string | null
          current_hp?: number
          id?: string
          initiative_bonus?: number | null
          level?: number | null
          max_hp?: number
          name?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          subscription_expires_at: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const 