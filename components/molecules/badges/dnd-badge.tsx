import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
  DndBadgeType,
  AbilityScore,
  Condition,
  DamageType,
  MagicSchool,
  CreatureType,
  CreatureSize,
  Alignment,
} from "./types"

// Category-specific styling variants
const dndBadgeVariants = cva(
  "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 tracking-wide",
  {
    variants: {
      category: {
        // Ability Scores - zinc theme
        ability: "border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300 capitalize font-bold",
        
        // Conditions - Amber theme
        condition: "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300 capitalize font-bold",
        
        // Damage Types - Orange theme
        damage: "border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300 capitalize font-bold",
        
        // Magic Schools - Purple theme
        magic: "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300 capitalize font-bold",
        
        // Creature Types - Emerald theme
        creature: "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 capitalize font-bold",
        
        // Size - Stone theme
        size: "border-stone-200 bg-stone-100 text-stone-800 dark:border-stone-800 dark:bg-stone-900/30 dark:text-stone-300 capitalize font-bold",
        
        // Alignment - Blue theme
        alignment: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize font-bold",
      },
    },
    defaultVariants: {
      category: "ability",
    },
  }
)

// Helper functions to get labels and determine categories
const getAbilityLabel = (ability: AbilityScore): string => {
  const labels: Record<AbilityScore, string> = {
    str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA",
  }
  return labels[ability]
}

const getConditionLabel = (condition: Condition): string => {
  const labels: Record<Condition, string> = {
    blinded: "Blinded", charmed: "Charmed", deafened: "Deafened", exhaustion: "Exhaustion",
    frightened: "Frightened", grappled: "Grappled", incapacitated: "Incapacitated", invisible: "Invisible",
    paralyzed: "Paralyzed", petrified: "Petrified", poisoned: "Poisoned", prone: "Prone",
    restrained: "Restrained", stunned: "Stunned", unconscious: "Unconscious",
  }
  return labels[condition]
}

const getDamageLabel = (damageType: DamageType): string => {
  const labels: Record<DamageType, string> = {
    acid: "Acid", cold: "Cold", fire: "Fire", force: "Force", lightning: "Lightning",
    necrotic: "Necrotic", poison: "Poison", psychic: "Psychic", radiant: "Radiant",
    thunder: "Thunder", bludgeoning: "Bludgeoning", piercing: "Piercing", slashing: "Slashing",
  }
  return labels[damageType]
}

const getMagicSchoolLabel = (school: MagicSchool): string => {
  const labels: Record<MagicSchool, string> = {
    abjuration: "Abjuration", conjuration: "Conjuration", divination: "Divination",
    enchantment: "Enchantment", evocation: "Evocation", illusion: "Illusion",
    necromancy: "Necromancy", transmutation: "Transmutation",
  }
  return labels[school]
}

const getCreatureTypeLabel = (creatureType: CreatureType): string => {
  const labels: Record<CreatureType, string> = {
    aberration: "Aberration", beast: "Beast", celestial: "Celestial", construct: "Construct",
    dragon: "Dragon", elemental: "Elemental", fey: "Fey", fiend: "Fiend",
    giant: "Giant", humanoid: "Humanoid", monstrosity: "Monstrosity", ooze: "Ooze",
    plant: "Plant", undead: "Undead",
  }
  return labels[creatureType]
}

const getSizeLabel = (size: CreatureSize): string => {
  return size // Already properly formatted
}

const getAlignmentLabel = (alignment: Alignment): string => {
  const labels: Record<Alignment, string> = {
    "lawful good": "LG", "neutral good": "NG", "chaotic good": "CG",
    "lawful neutral": "LN", "true neutral": "TN", "chaotic neutral": "CN",
    "lawful evil": "LE", "neutral evil": "NE", "chaotic evil": "CE",
    "unaligned": "UN",
  }
  return labels[alignment]
}

const getAlignmentFullLabel = (alignment: Alignment): string => {
  const labels: Record<Alignment, string> = {
    "lawful good": "Lawful Good", "neutral good": "Neutral Good", "chaotic good": "Chaotic Good",
    "lawful neutral": "Lawful Neutral", "true neutral": "True Neutral", "chaotic neutral": "Chaotic Neutral",
    "lawful evil": "Lawful Evil", "neutral evil": "Neutral Evil", "chaotic evil": "Chaotic Evil",
    "unaligned": "Unaligned",
  }
  return labels[alignment]
}

export interface DndBadgeProps extends VariantProps<typeof dndBadgeVariants> {
  badgeType: DndBadgeType
  value?: string | number
  showLabel?: boolean
  className?: string
}

export function DndBadge({
  badgeType,
  value,
  showLabel = true,
  className,
  ...props
}: DndBadgeProps) {
  // Type guards to determine which category the badge belongs to
  const isAbilityScore = (type: DndBadgeType): type is AbilityScore =>
    ["str", "dex", "con", "int", "wis", "cha"].includes(type)

  const isCondition = (type: DndBadgeType): type is Condition =>
    [
      "blinded", "charmed", "deafened", "exhaustion", "frightened", "grappled",
      "incapacitated", "invisible", "paralyzed", "petrified", "poisoned", "prone",
      "restrained", "stunned", "unconscious",
    ].includes(type)

  const isDamageType = (type: DndBadgeType): type is DamageType =>
    [
      "acid", "cold", "fire", "force", "lightning", "necrotic", "poison", "psychic",
      "radiant", "thunder", "bludgeoning", "piercing", "slashing",
    ].includes(type)

  const isMagicSchool = (type: DndBadgeType): type is MagicSchool =>
    [
      "abjuration", "conjuration", "divination", "enchantment", "evocation",
      "illusion", "necromancy", "transmutation",
    ].includes(type)

  const isCreatureType = (type: DndBadgeType): type is CreatureType =>
    [
      "aberration", "beast", "celestial", "construct", "dragon", "elemental",
      "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead",
    ].includes(type)

  const isCreatureSize = (type: DndBadgeType): type is CreatureSize =>
    ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"].includes(type)

  const isAlignment = (type: DndBadgeType): type is Alignment =>
    [
      "lawful good", "neutral good", "chaotic good", "lawful neutral", "true neutral",
      "chaotic neutral", "lawful evil", "neutral evil", "chaotic evil", "unaligned",
    ].includes(type)

  // Determine category and get appropriate label
  let category: "ability" | "condition" | "damage" | "magic" | "creature" | "size" | "alignment"
  let label: string
  let title: string

  if (isAbilityScore(badgeType)) {
    category = "ability"
    label = getAbilityLabel(badgeType)
    title = `${label}${typeof value === "number" ? `: ${value > 0 ? "+" : ""}${value}` : ""}`
  } else if (isCondition(badgeType)) {
    category = "condition"
    label = getConditionLabel(badgeType)
    title = label
  } else if (isDamageType(badgeType)) {
    category = "damage"
    label = getDamageLabel(badgeType)
    title = `${label}${value ? `: ${value}` : ""}`
  } else if (isMagicSchool(badgeType)) {
    category = "magic"
    label = getMagicSchoolLabel(badgeType)
    title = `${label}${typeof value === "number" ? ` Lv${value}` : ""}`
  } else if (isCreatureType(badgeType)) {
    category = "creature"
    label = getCreatureTypeLabel(badgeType)
    title = label
  } else if (isCreatureSize(badgeType)) {
    category = "size"
    label = getSizeLabel(badgeType)
    title = label
  } else if (isAlignment(badgeType)) {
    category = "alignment"
    label = showLabel ? getAlignmentFullLabel(badgeType) : getAlignmentLabel(badgeType)
    title = getAlignmentFullLabel(badgeType)
  } else {
    // Fallback
    return null
  }

  return (
    <Badge
      className={cn(dndBadgeVariants({ category }), className)}
      title={title}
      {...props}
    >
      {showLabel && label}
      {value && (isAbilityScore(badgeType) || isMagicSchool(badgeType) || isDamageType(badgeType)) && (
        <span className="ml-1 font-bold">
          {isAbilityScore(badgeType) && typeof value === "number" 
            ? (value > 0 ? `+${value}` : value)
            : isMagicSchool(badgeType) && typeof value === "number"
            ? `Lv${value}`
            : value
          }
        </span>
      )}
    </Badge>
  )
}
