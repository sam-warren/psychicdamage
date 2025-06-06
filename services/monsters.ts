import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/types/database'

type Monster = Tables<'monsters'>

export interface CreateMonsterData {
  name: string
  type?: string
  size?: string
  challenge_rating?: number
  armor_class?: number
  hit_points?: number
  source?: string
  is_homebrew?: boolean
}

export interface UpdateMonsterData {
  name?: string
  type?: string
  size?: string
  challenge_rating?: number
  armor_class?: number
  hit_points?: number
  source?: string
  is_homebrew?: boolean
}

export const monsterService = {
  // Get all monsters (with optional filters)
  async getMonsters(
    filters?: {
      type?: string
      challenge_rating_min?: number
      challenge_rating_max?: number
      is_homebrew?: boolean
      source?: string
    }
  ): Promise<Monster[]> {
    const supabase = await createClient()
    
    let query = supabase
      .from('monsters')
      .select('*')
      .order('name', { ascending: true })

    // Apply filters if provided
    if (filters) {
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.challenge_rating_min !== undefined) {
        query = query.gte('challenge_rating', filters.challenge_rating_min)
      }
      if (filters.challenge_rating_max !== undefined) {
        query = query.lte('challenge_rating', filters.challenge_rating_max)
      }
      if (filters.is_homebrew !== undefined) {
        query = query.eq('is_homebrew', filters.is_homebrew)
      }
      if (filters.source) {
        query = query.eq('source', filters.source)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch monsters:', error.message)
      throw new Error(`Failed to fetch monsters: ${error.message}`)
    }

    return data || []
  },

  // Get a single monster by ID
  async getMonster(monsterId: string): Promise<Monster | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('monsters')
      .select('*')
      .eq('id', monsterId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Monster not found
      }
      console.error('Failed to fetch monster:', error.message)
      throw new Error(`Failed to fetch monster: ${error.message}`)
    }

    return data
  },

  // Create a new monster (for homebrew)
  async createMonster(userId: string, monsterData: CreateMonsterData): Promise<Monster> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('monsters')
      .insert({
        ...monsterData,
        created_by: userId,
        is_homebrew: true,
        source: 'Homebrew',
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create monster:', error.message)
      throw new Error(`Failed to create monster: ${error.message}`)
    }

    return data
  },

  // Update an existing monster (only if created by user)
  async updateMonster(
    monsterId: string,
    userId: string,
    updates: UpdateMonsterData
  ): Promise<Monster> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('monsters')
      .update(updates)
      .eq('id', monsterId)
      .eq('created_by', userId) // Only allow updating own homebrew monsters
      .select()
      .single()

    if (error) {
      console.error('Failed to update monster:', error.message)
      throw new Error(`Failed to update monster: ${error.message}`)
    }

    return data
  },

  // Delete a monster (only if created by user)
  async deleteMonster(monsterId: string, userId: string): Promise<void> {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('monsters')
      .delete()
      .eq('id', monsterId)
      .eq('created_by', userId) // Only allow deleting own homebrew monsters

    if (error) {
      console.error('Failed to delete monster:', error.message)
      throw new Error(`Failed to delete monster: ${error.message}`)
    }
  },

  // Get unique values for filters
  async getFilterOptions() {
    const supabase = await createClient()
    
    const [typesResult, sourcesResult] = await Promise.all([
      supabase
        .from('monsters')
        .select('type')
        .not('type', 'is', null),
      supabase
        .from('monsters')
        .select('source')
        .not('source', 'is', null),
    ])

    const types = Array.from(new Set(typesResult.data?.map(m => m.type).filter(Boolean) || []))
    const sources = Array.from(new Set(sourcesResult.data?.map(m => m.source).filter(Boolean) || []))

    return {
      types: types.sort(),
      sources: sources.sort(),
    }
  },
} 