import { ColumnDef } from "@tanstack/react-table"
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
  IconStar,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react"

import { DragHandle } from "@/components/molecules/drag-handle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tables } from "@/types/database"

import { MonsterStatSheet } from "./monster-stat-sheet"
import {
  DndBadge,
  DndBadgeType,
  CreatureType,
  CreatureSize,
} from "../molecules/badges"

type Monster = Tables<"monsters">

export const creaturesTableColumns: ColumnDef<Monster>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Name</span>
        {column.getCanSort() && (
          <div className="">
            {column.getIsSorted() === "desc" ? (
              <IconChevronDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconChevronUp className="h-4 w-4" />
            ) : (
              <IconSelector className="h-4 w-4 opacity-50" />
            )}
          </div>
        )}
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="w-24">
          <MonsterStatSheet monster={row.original} />
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "challenge_rating",
    header: ({ column }) => (
      <div className="w-12 text-right flex items-center justify-end gap-2">
        <span>CR</span>
        {column.getCanSort() && (
          <div>
            {column.getIsSorted() === "desc" ? (
              <IconChevronDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconChevronUp className="h-4 w-4" />
            ) : (
              <IconSelector className="h-4 w-4 opacity-50" />
            )}
          </div>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-12 text-right font-medium">
        {row.original.challenge_rating ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "armor_class",
    header: ({ column }) => (
      <div className="w-12 text-right flex items-center justify-end gap-2">
        <span>AC</span>
        {column.getCanSort() && (
          <div>
            {column.getIsSorted() === "desc" ? (
              <IconChevronDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconChevronUp className="h-4 w-4" />
            ) : (
              <IconSelector className="h-4 w-4 opacity-50" />
            )}
          </div>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-12 text-right font-medium">
        {row.original.armor_class ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "hit_points",
    header: ({ column }) => (
      <div className="w-16 text-right flex items-center justify-end gap-2">
        <span>HP</span>
        {column.getCanSort() && (
          <div>
            {column.getIsSorted() === "desc" ? (
              <IconChevronDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconChevronUp className="h-4 w-4" />
            ) : (
              <IconSelector className="h-4 w-4 opacity-50" />
            )}
          </div>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-16 text-right font-medium">
        {row.original.hit_points ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <div className="w-20 flex items-center gap-2">
        <span>Type</span>
        {column.getCanSort() && (
          <div>
            {column.getIsSorted() === "desc" ? (
              <IconChevronDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconChevronUp className="h-4 w-4" />
            ) : (
              <IconSelector className="h-4 w-4 opacity-50" />
            )}
          </div>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const monsterType = row.original.type
      const validCreatureTypes: CreatureType[] = [
        "aberration",
        "beast",
        "celestial",
        "construct",
        "dragon",
        "elemental",
        "fey",
        "fiend",
        "giant",
        "humanoid",
        "monstrosity",
        "ooze",
        "plant",
        "undead",
      ]
      const isValidCreatureType =
        monsterType && validCreatureTypes.includes(monsterType as CreatureType)

      return (
        <div className="w-20 flex items-center gap-2">
          {isValidCreatureType ? (
            <DndBadge
              badgeType={monsterType as DndBadgeType}
              className="text-muted-foreground px-1.5"
            />
          ) : (
            <Badge
              variant="outline"
              className="text-muted-foreground px-1.5 capitalize"
            >
              {monsterType || "Unknown"}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <div className="w-16 flex items-center gap-2">
        <span>Size</span>
        {column.getCanSort() && (
          <div>
            {column.getIsSorted() === "desc" ? (
              <IconChevronDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconChevronUp className="h-4 w-4" />
            ) : (
              <IconSelector className="h-4 w-4 opacity-50" />
            )}
          </div>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const monsterSize = row.original.size
      const validSizes: CreatureSize[] = [
        "Tiny",
        "Small",
        "Medium",
        "Large",
        "Huge",
        "Gargantuan",
      ]
      const isValidSize =
        monsterSize && validSizes.includes(monsterSize as CreatureSize)

      return (
        <div className="w-16">
          {isValidSize ? (
            <DndBadge
              badgeType={monsterSize as DndBadgeType}
              showLabel={true}
            />
          ) : (
            <Badge
              variant="outline"
              className="text-muted-foreground px-1.5 capitalize"
            >
              {monsterSize || "Unknown"}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Source</span>
        {column.getCanSort() && (
          <div>
            {column.getIsSorted() === "desc" ? (
              <IconChevronDown className="h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <IconChevronUp className="h-4 w-4" />
            ) : (
              <IconSelector className="h-4 w-4 opacity-50" />
            )}
          </div>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const isHomebrew = row.original.is_homebrew
      return (
        <Badge
          variant={isHomebrew ? "default" : "secondary"}
          className="text-xs"
        >
          {isHomebrew ? (
            <IconCircleCheckFilled className="w-3 h-3 mr-1" />
          ) : (
            <IconLoader className="w-3 h-3 mr-1" />
          )}
          {row.original.source || "Unknown"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>
            <IconStar className="w-4 h-4 mr-2" />
            Add to favourites
          </DropdownMenuItem>
          {row.original.is_homebrew && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconTrash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
