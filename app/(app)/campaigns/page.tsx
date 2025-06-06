import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { campaignServerService } from '@/services/campaigns-server'
import { CampaignsClient } from '@/components/campaigns/campaigns-client'

export default async function CampaignsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  // Fetch campaigns server-side
  const campaigns = await campaignServerService.getCampaigns(data.user.id)

  return <CampaignsClient initialCampaigns={campaigns} />
} 