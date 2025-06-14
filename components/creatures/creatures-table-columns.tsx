import { ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
  IconStar,
  IconTrash,
} from "@tabler/icons-react";

import { DragHandle } from "@/components/molecules/drag-handle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tables } from "@/types/database";

import { MonsterStatSheet } from "./monster-stat-sheet";

type Monster = Tables<"monsters">;

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
    header: "Name",
    cell: ({ row }) => {
      return <MonsterStatSheet monster={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge
          variant="outline"
          className="text-muted-foreground px-1.5 capitalize"
        >
          {row.original.type || "Unknown"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-muted-foreground px-1.5 capitalize"
      >
        {row.original.size || "Unknown"}
      </Badge>
    ),
  },
  {
    accessorKey: "challenge_rating",
    header: () => <div className="w-full text-right">CR</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.challenge_rating ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "armor_class",
    header: () => <div className="w-full text-right">AC</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.armor_class ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "hit_points",
    header: () => <div className="w-full text-right">HP</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.hit_points ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const isHomebrew = row.original.is_homebrew;
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
      );
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
];
