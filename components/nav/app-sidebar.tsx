"use client"

import * as React from "react"
import {
  BookOpen,
  Sword,
  Users,
  Settings2,
  Home,
  Dice6,
  Scroll,
  Shield,
} from "lucide-react"

import { NavMain } from "@/components/nav/nav-main"
import { NavUser } from "@/components/nav/nav-user"
import { CampaignSwitcher } from "@/components/molecules/campaign-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { campaignService } from "@/lib/campaigns"
import { Tables } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

const campaignSchema = z.object({
  title: z.string().min(1, 'Campaign title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

type CampaignForm = z.infer<typeof campaignSchema>
type Campaign = Tables<'campaigns'>

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Campaign Tools",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Players",
        url: "/dashboard/players",
      },
      {
        title: "Encounters", 
        url: "/dashboard/encounters",
      },
      {
        title: "Notes",
        url: "/dashboard/notes",
      },
      {
        title: "NPCs",
        url: "/dashboard/npcs",
      },
    ],
  },
  {
    title: "Combat",
    url: "#",
    icon: Sword,
    items: [
      {
        title: "Initiative Tracker",
        url: "/dashboard/combat",
      },
      {
        title: "Monster Manual",
        url: "/dashboard/monsters",
      },
      {
        title: "Encounter Builder",
        url: "/dashboard/encounter-builder",
      },
    ],
  },
  {
    title: "Player Management",
    url: "#", 
    icon: Users,
    items: [
      {
        title: "Characters",
        url: "/dashboard/characters",
      },
      {
        title: "Sessions",
        url: "/dashboard/sessions",
      },
      {
        title: "Party Overview",
        url: "/dashboard/party",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "General",
        url: "/dashboard/settings",
      },
      {
        title: "Campaigns",
        url: "/dashboard/settings/campaigns",
      },
      {
        title: "Preferences",
        url: "/dashboard/settings/preferences",
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
  })

  const fetchCampaigns = React.useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const data = await campaignService.getCampaigns(user.id)
      setCampaigns(data)
    } catch {
      toast.error('Error fetching campaigns')
    } finally {
      setLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    if (user) {
      fetchCampaigns()
    }
  }, [user, fetchCampaigns])

  const onSubmit = async (data: CampaignForm) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const newCampaign = await campaignService.createCampaign(user.id, data)
      setCampaigns([newCampaign, ...campaigns])
      setIsCreateDialogOpen(false)
      toast.success('Campaign created successfully')
      reset()
    } catch {
      toast.error('Error creating campaign')
    } finally {
      setIsSubmitting(false)
    }
  }

  const userData = {
    name: user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    avatar: user?.user_metadata?.avatar_url || '',
  }

  const campaignData = campaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.title,
    description: campaign.description || '',
    icon: Shield,
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {loading ? (
          <div className="flex items-center justify-center h-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : campaignData.length > 0 ? (
          <CampaignSwitcher campaigns={campaignData} />
        ) : (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Create Your First Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Campaign</DialogTitle>
                <DialogDescription>
                  Create your first campaign to get started.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter campaign title"
                    {...register('title')}
                    disabled={isSubmitting}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter campaign description"
                    {...register('description')}
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Campaign'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
} 