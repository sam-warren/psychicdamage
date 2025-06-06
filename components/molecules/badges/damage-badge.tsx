import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { DamageType } from "./types"

const damageBadgeVariants = cva(
  "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 capitalize tracking-wide",
  {
    variants: {
      damageType: {
        acid: "border-lime-200 bg-lime-100 text-lime-800 dark:border-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
        cold: "border-cyan-200 bg-cyan-100 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
        fire: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
        force: "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
        lightning: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        necrotic: "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        poison: "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300",
        psychic: "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        radiant: "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        thunder: "border-indigo-200 bg-indigo-100 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
        bludgeoning: "border-stone-200 bg-stone-100 text-stone-800 dark:border-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
        piercing: "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
        slashing: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
      },
    },
    defaultVariants: {
      damageType: "fire",
    },
  }
)

const getDamageLabel = (damageType: DamageType): string => {
  const labels: Record<DamageType, string> = {
    acid: "Acid",
    cold: "Cold",
    fire: "Fire",
    force: "Force",
    lightning: "Lightning",
    necrotic: "Necrotic",
    poison: "Poison",
    psychic: "Psychic",
    radiant: "Radiant",
    thunder: "Thunder",
    bludgeoning: "Bludgeoning",
    piercing: "Piercing",
    slashing: "Slashing",
  }
  return labels[damageType]
}

export interface DamageBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children">,
    VariantProps<typeof damageBadgeVariants> {
  damageType: DamageType
  amount?: number | string
  showLabel?: boolean
  className?: string
}

export function DamageBadge({
  className,
  damageType,
  amount,
  showLabel = true,
  ...props
}: DamageBadgeProps) {
  const label = getDamageLabel(damageType)

  return (
    <Badge
      className={cn(damageBadgeVariants({ damageType }), className)}
      title={`${label}${amount ? `: ${amount}` : ""}`}
      {...props}
    >
      {showLabel && label}
      {amount && (
        <span className="ml-1 font-bold">
          {amount}
        </span>
      )}
    </Badge>
  )
} 