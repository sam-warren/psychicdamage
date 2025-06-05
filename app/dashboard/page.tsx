import { getUser } from '@/lib/auth'
import { campaignService } from '@/lib/campaigns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Sword, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getUser()
  const campaigns = user ? await campaignService.getCampaigns(user.id) : []
  
  const stats = {
    totalCampaigns: campaigns.length,
    totalPlayers: 0, // We'll calculate this when we add players
    activeCombats: 0, // We'll calculate this when we add encounters
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.email?.split('@')[0] || 'Dungeon Master'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your campaigns and adventures.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              Active campaigns you&apos;re managing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              Player characters across all campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Combats</CardTitle>
            <Sword className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCombats}</div>
            <p className="text-xs text-muted-foreground">
              Currently running encounters
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>
                  Your most recently updated campaigns
                </CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/dashboard/campaigns">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">No campaigns yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You haven&apos;t created any campaigns yet. Start by creating your first campaign to begin your D&amp;D adventure!
                </p>
                <Button asChild>
                  <Link href="/dashboard/campaigns">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{campaign.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {campaign.description || 'No description'}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
                {campaigns.length >= 5 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/campaigns">View All Campaigns</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks to manage your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/campaigns">
                <BookOpen className="h-4 w-4 mr-2" />
                Manage Campaigns
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/combat">
                <Sword className="h-4 w-4 mr-2" />
                Start Combat Encounter
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/players">
                <Users className="h-4 w-4 mr-2" />
                Manage Players
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 