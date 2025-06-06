"use client"

import * as React from "react"
import {
  BookOpen,
  Sword,
  Users,
  Settings2,
  Home,
  Shield,
  Plus,
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
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { campaignService } from "@/services/campaigns"
import { Tables } from "@/types/database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as z from "zod"
import { toast } from "sonner"
import {
  CampaignForm,
  campaignSchema,
  type CampaignFormData,
} from "@/components/forms/campaign-form"

type CampaignForm = z.infer<typeof campaignSchema>
type Campaign = Tables<"campaigns">

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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  campaigns: Campaign[]
}

export function AppSidebar({ campaigns, ...props }: AppSidebarProps) {
  const { user } = useAuth()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const onSubmit = async (data: CampaignFormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const newCampaign = await campaignService.createCampaign(user.id, data)
      campaigns.push(newCampaign)
      setIsCreateDialogOpen(false)
      toast.success("Campaign created successfully")
    } catch {
      toast.error("Error creating campaign")
    } finally {
      setIsSubmitting(false)
    }
  }

  const userData = {
    name:
      user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User",
    email: user?.email || "user@example.com",
    avatar: user?.user_metadata?.avatar_url || "",
  }

  const campaignData = campaigns.map((campaign) => ({
    id: campaign.id,
    name: campaign.title,
    description: campaign.description || "",
    icon: Shield,
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {campaignData.length > 0 ? (
          <CampaignSwitcher campaigns={campaignData} />
        ) : (
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="New Campaign"
                    isActive={isCreateDialogOpen}
                  >
                    <Plus />
                    <span>New Campaign</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
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
                onCancel={() => setIsCreateDialogOpen(false)}
                isSubmitting={isSubmitting}
              />
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
