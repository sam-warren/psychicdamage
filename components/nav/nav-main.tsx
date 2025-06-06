"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { state, isMobile } = useSidebar()
  const pathname = usePathname()

  // Helper function to check if an item is active
  const isItemActive = (item: { url: string; items?: { url: string }[] }) => {
    // For direct links (no subitems), check exact match or if it's a parent path
    if (!item.items && item.url !== "#") {
      return pathname === item.url || pathname.startsWith(item.url + "/")
    }
    
    // For items with subitems, check if any subitem matches the current path
    if (item.items) {
      return item.items.some(subItem => 
        pathname === subItem.url || pathname.startsWith(subItem.url + "/")
      )
    }
    
    return false
  }

  // Helper function to check if a subitem is active
  const isSubItemActive = (subItem: { url: string }) => {
    return pathname === subItem.url || pathname.startsWith(subItem.url + "/")
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Campaign Manager</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const itemIsActive = isItemActive(item)
          const hasActiveSubItem = item.items?.some(subItem => isSubItemActive(subItem))

          // If item has no sub-items and url is not "#", render as direct link
          if (!item.items && item.url !== "#") {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  tooltip={item.title}
                  isActive={itemIsActive}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // For items with sub-items, show dropdown when collapsed (click-only), collapsible when expanded
          if (item.items && state === "collapsed") {
            return (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      isActive={itemIsActive}
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="start"
                    side={isMobile ? "bottom" : "right"}
                    sideOffset={4}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                      {item.title}
                    </DropdownMenuLabel>
                    {item.items.map((subItem) => (
                      <DropdownMenuItem key={subItem.title} asChild>
                        <Link 
                          href={subItem.url} 
                          className={`gap-2 p-2 cursor-pointer ${
                            isSubItemActive(subItem) ? 'bg-accent text-accent-foreground' : ''
                          }`}
                        >
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{subItem.title}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )
          }

          // Render as collapsible for expanded state
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={hasActiveSubItem}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={itemIsActive}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.items && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isSubItemActive(subItem)}>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
} 