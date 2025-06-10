import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { DndBadge } from "@/components/molecules/badges/dnd-badge"
import {
  CreatureSize,
  CreatureType,
  Alignment,
} from "@/components/molecules/badges/types"
import { Tables } from "@/types/database"

type Creature = Tables<"monsters">

interface HeaderProps {
  creature: Creature
}

export function Header({ creature }: HeaderProps) {
  return (
    <DrawerHeader className="gap-1">
      <DrawerTitle className="text-2xl font-bold">{creature.name}</DrawerTitle>
      <DrawerDescription className="text-base">
        <DndBadge badgeType={creature.size as CreatureSize} className="mr-2" />
        <DndBadge badgeType={creature.type as CreatureType} className="mr-2" />
        <DndBadge
          badgeType={creature.alignment as Alignment}
          className="mr-2"
        />
        {creature.subtype && ` (${creature.subtype})`}
      </DrawerDescription>
    </DrawerHeader>
  )
}
