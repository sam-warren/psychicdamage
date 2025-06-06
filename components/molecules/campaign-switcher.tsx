"use client";

import { ChevronsUpDown, Ellipsis, Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { CreateCampaignDialog } from "@/components/campaigns/create-campaign-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function CampaignSwitcher({
  campaigns,
}: {
  campaigns: {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeCampaign, setActiveCampaign] = React.useState(campaigns[0]);

  if (!activeCampaign) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeCampaign.icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeCampaign.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeCampaign.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Campaigns
            </DropdownMenuLabel>
            {campaigns.map((campaign, index) => (
              <DropdownMenuItem
                key={campaign.id}
                onClick={() => setActiveCampaign(campaign)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <campaign.icon className="size-3.5 shrink-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{campaign.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {campaign.description}
                  </span>
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 p-2">
              <Link href="/campaigns">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Ellipsis className="size-4" />
                </div>
                <div className="font-medium">View All</div>
              </Link>
            </DropdownMenuItem>
            <CreateCampaignDialog
              trigger={
                <DropdownMenuItem 
                  className="gap-2 p-2"
                  onSelect={(e) => e.preventDefault()}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium">New Campaign</div>
                  <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
