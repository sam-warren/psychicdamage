import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AbilityScore } from "./types"

const abilityBadgeVariants = cva(
  "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 uppercase tracking-wide",
  {
    variants: {
      ability: {
        str: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
        dex: "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300",
        con: "border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        int: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        wis: "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        cha: "border-pink-200 bg-pink-100 text-pink-800 dark:border-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      },
    },
    defaultVariants: {
      ability: "str",
    },
  }
)

const getAbilityLabel = (ability: AbilityScore): string => {
  const labels: Record<AbilityScore, string> = {
    str: "STR",
    dex: "DEX",
    con: "CON",
    int: "INT",
    wis: "WIS",
    cha: "CHA",
  }
  return labels[ability]
}

export interface AbilityBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children">,
    VariantProps<typeof abilityBadgeVariants> {
  ability: AbilityScore
  modifier?: number
  showLabel?: boolean
  className?: string
}

export function AbilityBadge({
  className,
  ability,
  modifier,
  showLabel = true,
  ...props
}: AbilityBadgeProps) {
  const label = getAbilityLabel(ability)

  return (
    <Badge
      className={cn(abilityBadgeVariants({ ability }), className)}
      title={`${label}${modifier ? `: ${modifier}` : ""}`}
      {...props}
    >
      {showLabel && label}
      {modifier && (
        <span className="ml-1 font-bold">
          {typeof modifier === "number" && modifier > 0 ? `+${modifier}` : modifier}
        </span>
      )}
    </Badge>
  )
} 