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

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { CampaignSwitcher } from "@/components/campaign-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"

// Sample data - will be replaced with real data later
const mockCampaigns = [
  {
    id: "1",
    name: "Curse of Strahd",
    description: "Gothic Horror Campaign",
    icon: Shield,
  },
  {
    id: "2", 
    name: "Dragon Heist",
    description: "Urban Adventure",
    icon: Dice6,
  },
  {
    id: "3",
    name: "Storm King's Thunder", 
    description: "Giant-themed Campaign",
    icon: Scroll,
  },
]

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
  const { user, profile } = useAuth()

  const userData = {
    name: profile?.display_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    avatar: profile?.avatar_url || '',
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CampaignSwitcher campaigns={mockCampaigns} />
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