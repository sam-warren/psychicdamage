import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Tables } from "@/types/database"

import { StatSheet } from "../stat-sheet"

type Monster = Tables<"monsters">

interface CreatureDrawerProps {
  creature: Monster
}

export function CreatureDrawer({ creature }: CreatureDrawerProps) {
  return (
    <Drawer direction={"bottom"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {creature.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-5xl mx-auto px-4">
        <StatSheet creature={creature} />
      </DrawerContent>
    </Drawer>
  )
}
