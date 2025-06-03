import { supabase } from './supabase'
import { Campaign } from '@/types/database'

export interface CreateCampaignData {
  title: string
  description?: string
  settings?: Record<string, any>
}

export interface UpdateCampaignData {
  title?: string
  description?: string
  settings?: Record<string, any>
}

export const campaignService = {
  // Get all campaigns for the current user
  async getCampaigns(userId: string): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch campaigns: ${error.message}`)
    }

    return data || []
  },

  // Get a single campaign by ID
  async getCampaign(campaignId: string, userId: string): Promise<Campaign | null> {
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
      throw new Error(`Failed to fetch campaign: ${error.message}`)
    }

    return data
  },

  // Create a new campaign
  async createCampaign(userId: string, campaignData: CreateCampaignData): Promise<Campaign> {
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
      throw new Error(`Failed to update campaign: ${error.message}`)
    }

    return data
  },

  // Delete a campaign
  async deleteCampaign(campaignId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`)
    }
  },

  // Get campaign stats
  async getCampaignStats(campaignId: string) {
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

    return {
      playerCount: playersResult.count || 0,
      encounterCount: encountersResult.count || 0,
    }
  },
} 