import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Alignment } from "./types"

const alignmentBadgeVariants = cva(
  "inline-flex items-center justify-center px-3 py-1 text-xs font-bold w-fit whitespace-nowrap shrink-0 gap-1 uppercase tracking-wide border shadow-lg",
  {
    variants: {
      alignment: {
        // Good Row (Top) - Lighter shades
        "lawful good": "bg-blue-400 text-white border-blue-500",
        "neutral good": "bg-emerald-400 text-white border-emerald-500", 
        "chaotic good": "bg-purple-400 text-white border-purple-500",
        
        // Neutral Row (Middle) - Medium shades
        "lawful neutral": "bg-blue-600 text-white border-blue-700",
        "true neutral": "bg-gray-500 text-white border-gray-600",
        "chaotic neutral": "bg-purple-600 text-white border-purple-700",
        
        // Evil Row (Bottom) - Darker shades
        "lawful evil": "bg-blue-800 text-white border-blue-900",
        "neutral evil": "bg-gray-800 text-white border-gray-900",
        "chaotic evil": "bg-purple-800 text-white border-purple-900",
        
        // Outside the grid
        "unaligned": "bg-slate-500 text-white border-slate-600",
      },
    },
    defaultVariants: {
      alignment: "true neutral",
    },
  }
)

const getAlignmentLabel = (alignment: Alignment): string => {
  const labels: Record<Alignment, string> = {
    "lawful good": "Lawful Good",
    "neutral good": "Neutral Good",
    "chaotic good": "Chaotic Good",
    "lawful neutral": "Lawful Neutral",
    "true neutral": "True Neutral",
    "chaotic neutral": "Chaotic Neutral",
    "lawful evil": "Lawful Evil",
    "neutral evil": "Neutral Evil",
    "chaotic evil": "Chaotic Evil",
    "unaligned": "Unaligned",
  }
  return labels[alignment]
}

const getAlignmentAbbreviation = (alignment: Alignment): string => {
  const abbreviations: Record<Alignment, string> = {
    "lawful good": "LG",
    "neutral good": "NG",
    "chaotic good": "CG",
    "lawful neutral": "LN",
    "true neutral": "TN",
    "chaotic neutral": "CN",
    "lawful evil": "LE",
    "neutral evil": "NE",
    "chaotic evil": "CE",
    "unaligned": "UN",
  }
  return abbreviations[alignment]
}

export interface AlignmentBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children">,
    VariantProps<typeof alignmentBadgeVariants> {
  alignment: Alignment
  showFullLabel?: boolean
  className?: string
}

export function AlignmentBadge({
  className,
  alignment,
  showFullLabel = false,
  ...props
}: AlignmentBadgeProps) {
  const label = getAlignmentLabel(alignment)
  const abbreviation = getAlignmentAbbreviation(alignment)

  return (
    <Badge
      className={cn(alignmentBadgeVariants({ alignment }), className)}
      title={label}
      {...props}
    >
      {showFullLabel ? label : abbreviation}
    </Badge>
  )
} 