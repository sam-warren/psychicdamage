import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CreatureType } from "./types"

const creatureTypeBadgeVariants = cva(
  "inline-flex items-center justify-center px-3 py-1 text-xs font-bold w-fit whitespace-nowrap shrink-0 gap-1 uppercase tracking-wide border shadow-lg",
  {
    variants: {
      creatureType: {
        aberration: "border-purple-100 bg-purple-100 text-white dark:border-purple-900 dark:bg-purple-900 dark:text-white",
        beast: "border-green-100 bg-green-100 text-white dark:border-green-900 dark:bg-green-900 dark:text-white",
        celestial: "border-yellow-100 bg-yellow-100 text-white dark:border-yellow-900 dark:bg-yellow-900 dark:text-white",
        construct: "border-stone-100 bg-stone-100 text-white dark:border-stone-900 dark:bg-stone-900 dark:text-white",
        dragon: "border-red-100 bg-red-100 text-white dark:border-red-900 dark:bg-red-900 dark:text-white",
        elemental: "border-blue-100 bg-blue-100 text-white dark:border-blue-900 dark:bg-blue-900 dark:text-white",
        fey: "border-emerald-100 bg-emerald-100 text-white dark:border-emerald-900 dark:bg-emerald-900 dark:text-white",
        fiend: "border-red-100 bg-red-100 text-white dark:border-red-900 dark:bg-red-900 dark:text-white",
        giant: "border-orange-100 bg-orange-100 text-white dark:border-orange-900 dark:bg-orange-900 dark:text-white",
        humanoid: "border-blue-100 bg-blue-100 text-white dark:border-blue-900 dark:bg-blue-900 dark:text-white",
        monstrosity: "border-violet-100 bg-violet-100 text-white dark:border-violet-900 dark:bg-violet-900 dark:text-white",
        ooze: "border-lime-100 bg-lime-100 text-white dark:border-lime-900 dark:bg-lime-900 dark:text-white",
        plant: "border-green-100 bg-green-100 text-white dark:border-green-900 dark:bg-green-900 dark:text-white",
        undead: "border-gray-100 bg-gray-100 text-white dark:border-gray-900 dark:bg-gray-900 dark:text-white",
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