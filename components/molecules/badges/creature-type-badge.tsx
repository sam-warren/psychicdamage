import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CreatureType } from "./types"

const creatureTypeBadgeVariants = cva(
  "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 capitalize tracking-wide",
  {
    variants: {
      creatureType: {
        aberration: "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        beast: "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300",
        celestial: "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        construct: "border-stone-200 bg-stone-100 text-stone-800 dark:border-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
        dragon: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
        elemental: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        fey: "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
        fiend: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
        giant: "border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        humanoid: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        monstrosity: "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
        ooze: "border-lime-200 bg-lime-100 text-lime-800 dark:border-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
        plant: "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300",
        undead: "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
      },
    },
    defaultVariants: {
      creatureType: "humanoid",
    },
  }
)

const getCreatureTypeLabel = (creatureType: CreatureType): string => {
  const labels: Record<CreatureType, string> = {
    aberration: "Aberration",
    beast: "Beast",
    celestial: "Celestial",
    construct: "Construct",
    dragon: "Dragon",
    elemental: "Elemental",
    fey: "Fey",
    fiend: "Fiend",
    giant: "Giant",
    humanoid: "Humanoid",
    monstrosity: "Monstrosity",
    ooze: "Ooze",
    plant: "Plant",
    undead: "Undead",
  }
  return labels[creatureType]
}

export interface CreatureTypeBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children">,
    VariantProps<typeof creatureTypeBadgeVariants> {
  creatureType: CreatureType
  showLabel?: boolean
  className?: string
}

export function CreatureTypeBadge({
  className,
  creatureType,
  showLabel = true,
  ...props
}: CreatureTypeBadgeProps) {
  const label = getCreatureTypeLabel(creatureType)

  return (
    <Badge
      className={cn(creatureTypeBadgeVariants({ creatureType }), className)}
      title={label}
      {...props}
    >
      {showLabel && label}
    </Badge>
  )
} 