import { CampaignActions } from '@/components/campaigns/campaign-actions'
import { CreateCampaignDialog } from '@/components/campaigns/create-campaign-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { campaignService } from '@/services/campaigns'
import { formatDistanceToNow } from 'date-fns'
import { BookOpen, Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function CampaignsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  const campaigns = await campaignService.getCampaigns(data.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your D&D campaigns and sessions
          </p>
        </div>
        <CreateCampaignDialog />
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Create your first campaign to start managing your D&D sessions, players, and encounters.
            </p>
            <CreateCampaignDialog triggerText="Create Your First Campaign" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {campaign.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <CampaignActions campaign={campaign} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {campaign.updated_at 
                      ? `Updated ${formatDistanceToNow(new Date(campaign.updated_at), { addSuffix: true })}`
                      : campaign.created_at 
                        ? `Created ${formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}`
                        : 'Recently created'
                    }
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/campaigns/${campaign.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/campaigns/${campaign.id}/players`}>
                        <Users className="h-4 w-4 mr-2" />
                        Manage
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 