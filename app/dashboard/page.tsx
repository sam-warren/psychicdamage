'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Campaign } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, Users, Sword, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalPlayers: 0,
    activeCombats: 0,
  })

  useEffect(() => {
    if (user) {
      fetchCampaigns()
      fetchStats()
    }
  }, [user])

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(5)

      if (error) {
        toast.error('Error fetching campaigns')
        return
      }

      setCampaigns(data || [])
    } catch (error) {
      toast.error('Error fetching campaigns')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get total campaigns
      const { count: campaignCount } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      // Get total players across all campaigns
      const { count: playerCount } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .in('campaign_id', 
          campaigns.length > 0 
            ? campaigns.map(c => c.id)
            : [''] // Empty array if no campaigns
        )

      // Get active encounters
      const { count: encounterCount } = await supabase
        .from('encounters')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .in('campaign_id', 
          campaigns.length > 0 
            ? campaigns.map(c => c.id)
            : [''] // Empty array if no campaigns
        )

      setStats({
        totalCampaigns: campaignCount || 0,
        totalPlayers: playerCount || 0,
        activeCombats: encounterCount || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.display_name || user?.email?.split('@')[0] || 'Dungeon Master'}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your campaigns and adventures.
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
              Active campaigns you're managing
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
                  Create your first campaign to start your D&D adventure
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
              <Sparkles className="h-5 w-5" />
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