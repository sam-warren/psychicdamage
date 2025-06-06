'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { campaignService } from '@/services/campaigns'

export async function createCampaign(data: { title: string; description?: string }) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    await campaignService.createCampaign(user.id, data)
    revalidatePath('/campaigns')
    revalidatePath('/(app)', 'layout') // Revalidate layout to update sidebar
  } catch (error) {
    throw new Error('Failed to create campaign')
  }
}

export async function updateCampaign(campaignId: string, data: { title?: string; description?: string }) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    await campaignService.updateCampaign(campaignId, user.id, data)
    revalidatePath('/campaigns')
    revalidatePath('/(app)', 'layout') // Revalidate layout to update sidebar
  } catch (error) {
    throw new Error('Failed to update campaign')
  }
}

export async function deleteCampaign(campaignId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    await campaignService.deleteCampaign(campaignId, user.id)
    revalidatePath('/campaigns')
    revalidatePath('/(app)', 'layout') // Revalidate layout to update sidebar
  } catch (error) {
    throw new Error('Failed to delete campaign')
  }
} 