import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/types/database'

type Campaign = Tables<'campaigns'>

export interface CreateCampaignData {
  title: string
  description?: string
  settings?: Record<string, unknown>
}

export interface UpdateCampaignData {
  title?: string
  description?: string
  settings?: Record<string, unknown>
}

export const campaignServerService = {
  // Get all campaigns for the current user
  async getCampaigns(userId: string): Promise<Campaign[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch campaigns:', error.message)
      throw new Error(`Failed to fetch campaigns: ${error.message}`)
    }

    return data || []
  },

  // Get a single campaign by ID
  async getCampaign(campaignId: string, userId: string): Promise<Campaign | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Campaign not found
      }
      console.error('Failed to fetch campaign:', error.message)
      throw new Error(`Failed to fetch campaign: ${error.message}`)
    }

    return data
  },

  // Create a new campaign
  async createCampaign(userId: string, campaignData: CreateCampaignData): Promise<Campaign> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        title: campaignData.title,
        description: campaignData.description || null,
        settings: campaignData.settings || {},
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create campaign:', error.message)
      throw new Error(`Failed to create campaign: ${error.message}`)
    }

    return data
  },

  // Update an existing campaign
  async updateCampaign(
    campaignId: string,
    userId: string,
    updates: UpdateCampaignData
  ): Promise<Campaign> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('campaigns')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Failed to update campaign:', error.message)
      throw new Error(`Failed to update campaign: ${error.message}`)
    }

    return data
  },

  // Delete a campaign
  async deleteCampaign(campaignId: string, userId: string): Promise<void> {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to delete campaign:', error.message)
      throw new Error(`Failed to delete campaign: ${error.message}`)
    }
  },

  // Get campaign stats
  async getCampaignStats(campaignId: string) {
    const supabase = await createClient()
    
    const [playersResult, encountersResult] = await Promise.all([
      supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaignId),
      supabase
        .from('encounters')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaignId),
    ])

    if (playersResult.error) {
      console.error('Failed to fetch player count:', playersResult.error.message)
    }
    
    if (encountersResult.error) {
      console.error('Failed to fetch encounter count:', encountersResult.error.message)
    }

    return {
      playerCount: playersResult.count || 0,
      encounterCount: encountersResult.count || 0,
    }
  },
} 