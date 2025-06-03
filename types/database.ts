export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          subscription_tier: string
          subscription_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          settings: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          settings?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          settings?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          campaign_id: string
          name: string
          max_hp: number
          current_hp: number
          ac: number
          initiative_bonus: number
          level: number
          ability_scores: Record<string, any>
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          name: string
          max_hp?: number
          current_hp?: number
          ac?: number
          initiative_bonus?: number
          level?: number
          ability_scores?: Record<string, any>
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          name?: string
          max_hp?: number
          current_hp?: number
          ac?: number
          initiative_bonus?: number
          level?: number
          ability_scores?: Record<string, any>
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type Player = Database['public']['Tables']['players']['Row'] 