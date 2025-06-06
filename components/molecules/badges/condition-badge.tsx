import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Condition } from "./types"

const conditionBadgeVariants = cva(
  "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 capitalize tracking-wide",
  {
    variants: {
      condition: {
        blinded: "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        charmed: "border-pink-200 bg-pink-100 text-pink-800 dark:border-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
        deafened: "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        exhaustion: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
        frightened: "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        grappled: "border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        incapacitated: "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
        invisible: "border-cyan-200 bg-cyan-100 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
        paralyzed: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
        petrified: "border-stone-200 bg-stone-100 text-stone-800 dark:border-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
        poisoned: "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
        prone: "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        restrained: "border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        stunned: "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        unconscious: "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
      },
    },
    defaultVariants: {
      condition: "blinded",
    },
  }
)

const getConditionLabel = (condition: Condition): string => {
  const labels: Record<Condition, string> = {
    blinded: "Blinded",
    charmed: "Charmed",
    deafened: "Deafened",
    exhaustion: "Exhaustion",
    frightened: "Frightened",
    grappled: "Grappled",
    incapacitated: "Incapacitated",
    invisible: "Invisible",
    paralyzed: "Paralyzed",
    petrified: "Petrified",
    poisoned: "Poisoned",
    prone: "Prone",
    restrained: "Restrained",
    stunned: "Stunned",
    unconscious: "Unconscious",
  }
  return labels[condition]
}

export interface ConditionBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children">,
    VariantProps<typeof conditionBadgeVariants> {
  condition: Condition
  showLabel?: boolean
  className?: string
}

export function ConditionBadge({
  className,
  condition,
  showLabel = true,
  ...props
}: ConditionBadgeProps) {
  const label = getConditionLabel(condition)

  return (
    <Badge
      className={cn(conditionBadgeVariants({ condition }), className)}
      title={label}
      {...props}
    >
      {showLabel && label}
    </Badge>
  )
} 