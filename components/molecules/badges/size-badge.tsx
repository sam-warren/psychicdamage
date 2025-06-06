import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CreatureSize } from "./types"

const sizeBadgeVariants = cva(
  "inline-flex items-center justify-center px-3 py-1 text-xs font-bold w-fit whitespace-nowrap shrink-0 gap-1 uppercase tracking-wide border shadow-lg",
  {
    variants: {
      size: {
        Tiny: "bg-stone-900 text-white border-stone-900",
        Small: "bg-stone-800 text-white border-stone-900",
        Medium: "bg-stone-700 text-white border-stone-800",
        Large: "bg-stone-500 text-white border-stone-600",
        Huge: "bg-stone-300 text-black border-stone-400",
        Gargantuan: "bg-stone-100 text-black border-stone-200",
      },
    },
    defaultVariants: {
      size: "Medium",
    },
  }
)

const getSizeLabel = (size: CreatureSize): string => {
  const labels: Record<CreatureSize, string> = {
    Tiny: "Tiny",
    Small: "Small",
    Medium: "Medium",
    Large: "Large",
    Huge: "Huge",
    Gargantuan: "Gargantuan",
  }
  return labels[size]
}

const getSizeAbbreviation = (size: CreatureSize): string => {
  const abbreviations: Record<CreatureSize, string> = {
    Tiny: "T",
    Small: "S",
    Medium: "M",
    Large: "L",
    Huge: "H",
    Gargantuan: "G",
  }
  return abbreviations[size]
}

export interface SizeBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children">,
    VariantProps<typeof sizeBadgeVariants> {
  size: CreatureSize
  showFullLabel?: boolean
  className?: string
}

export function SizeBadge({
  className,
  size,
  showFullLabel = false,
  ...props
}: SizeBadgeProps) {
  const label = getSizeLabel(size)
  const abbreviation = getSizeAbbreviation(size)

  return (
    <Badge
      className={cn(sizeBadgeVariants({ size }), className)}
      title={label}
      {...props}
    >
      {showFullLabel ? label : abbreviation}
    </Badge>
  )
}
