"use client";

import {
  BookOpen,
  Home,
  Settings2,
  Shield,
  Sword,
  Users,
  Plus,
} from "lucide-react";
import * as React from "react";

import { CreateCampaignDialog } from "@/components/campaigns/create-campaign-dialog";
import { CampaignSwitcher } from "@/components/molecules/campaign-switcher";
import { NavMain } from "@/components/nav/nav-main";
import { NavUser } from "@/components/nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Tables } from "@/types/database";

type Campaign = Tables<"campaigns">;

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Campaign Tools",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Players",
        url: "/players",
      },
      {
        title: "Creatures",
        url: "/creatures",
      },
      {
        title: "Encounters",
        url: "/encounters",
      },
      {
        title: "Notes",
        url: "/notes",
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
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  campaigns: Campaign[];
}

export function AppSidebar({ campaigns, ...props }: AppSidebarProps) {
  const { user } = useAuth();

  const userData = {
    name:
      user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User",
    email: user?.email || "user@example.com",
    avatar: user?.user_metadata?.avatar_url || "",
  };

  const campaignData = campaigns.map((campaign) => ({
    id: campaign.id,
    name: campaign.title,
    description: campaign.description || "",
    icon: Shield,
  }));

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        {campaignData.length > 0 ? (
          <CampaignSwitcher campaigns={campaignData} />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <CreateCampaignDialog
                triggerText="New Campaign"
                trigger={
                  <SidebarMenuButton>
                    <Plus className="h-4 w-4" />
                    New Campaign
                  </SidebarMenuButton>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
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
  );
}
