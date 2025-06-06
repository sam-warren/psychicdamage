import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { MagicSchool } from "./types"

const magicSchoolBadgeVariants = cva(
  "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 capitalize tracking-wide",
  {
    variants: {
      school: {
        abjuration: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        conjuration: "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        divination: "border-cyan-200 bg-cyan-100 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
        enchantment: "border-pink-200 bg-pink-100 text-pink-800 dark:border-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
        evocation: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300",
        illusion: "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
        necromancy: "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        transmutation: "border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      },
    },
    defaultVariants: {
      school: "abjuration",
    },
  }
)

const getMagicSchoolLabel = (school: MagicSchool): string => {
  const labels: Record<MagicSchool, string> = {
    abjuration: "Abjuration",
    conjuration: "Conjuration",
    divination: "Divination",
    enchantment: "Enchantment",
    evocation: "Evocation",
    illusion: "Illusion",
    necromancy: "Necromancy",
    transmutation: "Transmutation",
  }
  return labels[school]
}

export interface MagicSchoolBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children">,
    VariantProps<typeof magicSchoolBadgeVariants> {
  school: MagicSchool
  level?: number
  showLabel?: boolean
  className?: string
}

export function MagicSchoolBadge({
  className,
  school,
  level,
  showLabel = true,
  ...props
}: MagicSchoolBadgeProps) {
  const label = getMagicSchoolLabel(school)

  return (
    <Badge
      className={cn(magicSchoolBadgeVariants({ school }), className)}
      title={`${label}${level ? ` Lv${level}` : ""}`}
      {...props}
    >
      {showLabel && label}
      {level && (
        <span className="ml-1 font-bold">
          Lv{level}
        </span>
      )}
    </Badge>
  )
} 