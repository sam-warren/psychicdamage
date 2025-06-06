'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { campaignService } from '@/services/campaigns'
import { Tables } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Edit, Trash2, Users, Calendar, BookOpen, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { CampaignForm, campaignSchema, type CampaignFormData } from '@/components/forms/campaign-form'
import { useRouter } from 'next/navigation'

type Campaign = Tables<'campaigns'>

interface CampaignsClientProps {
  initialCampaigns: Campaign[]
}

export function CampaignsClient({ initialCampaigns }: CampaignsClientProps) {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const {
    reset,
    setValue,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  })

  // Function to refresh campaigns from server
  const refreshCampaigns = async () => {
    if (!user) return
    
    setIsRefreshing(true)
    try {
      const freshCampaigns = await campaignService.getCampaigns(user.id)
      setCampaigns(freshCampaigns)
    } catch (error) {
      console.error('Failed to refresh campaigns:', error)
      toast.error('Failed to refresh campaigns')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Auto-refresh campaigns when the component first mounts or when user changes
  useEffect(() => {
    if (user) {
      refreshCampaigns()
    }
  }, [user])

  // Also refresh when initialCampaigns changes (e.g., when navigating back to this page after creating a campaign elsewhere)
  useEffect(() => {
    setCampaigns(initialCampaigns)
  }, [initialCampaigns])

  // Optional: Auto-refresh every 30 seconds if the tab is visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        refreshCampaigns()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user])

  const onSubmit = async (data: CampaignFormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      if (editingCampaign) {
        // Update existing campaign
        const updatedCampaign = await campaignService.updateCampaign(
          editingCampaign.id,
          user.id,
          data
        )
        setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c))
        setIsEditDialogOpen(false)
        setEditingCampaign(null)
        toast.success('Campaign updated successfully')
        router.refresh() // Refresh server data
      } else {
        // Create new campaign
        const newCampaign = await campaignService.createCampaign(user.id, data)
        setCampaigns([newCampaign, ...campaigns])
        setIsCreateDialogOpen(false)
        toast.success('Campaign created successfully')
        router.refresh() // Refresh server data
      }
      reset()
    } catch {
      toast.error(editingCampaign ? 'Error updating campaign' : 'Error creating campaign')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setValue('title', campaign.title)
    setValue('description', campaign.description || '')
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (campaign: Campaign) => {
    if (!user) return

    try {
      await campaignService.deleteCampaign(campaign.id, user.id)
      setCampaigns(campaigns.filter(c => c.id !== campaign.id))
      toast.success('Campaign deleted successfully')
      router.refresh() // Refresh server data
    } catch {
      toast.error('Error deleting campaign')
    }
  }

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
    setEditingCampaign(null)
    reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your D&D campaigns and sessions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshCampaigns}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>
                  Create a new campaign to start your D&amp;D adventure.
                </DialogDescription>
              </DialogHeader>
              <CampaignForm
                mode="create"
                onSubmit={onSubmit}
                onCancel={handleDialogClose}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Create your first campaign to start managing your D&D sessions, players, and encounters.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{campaign.title}&quot;? This action cannot be undone and will delete all associated players, encounters, and notes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(campaign)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Campaign
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update your campaign details.
            </DialogDescription>
          </DialogHeader>
          <CampaignForm
            mode="edit"
            campaign={editingCampaign || undefined}
            onSubmit={onSubmit}
            onCancel={handleDialogClose}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 