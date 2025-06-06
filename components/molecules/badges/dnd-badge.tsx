import * as React from "react"
import { 
  AbilityBadge, 
  ConditionBadge, 
  DamageBadge, 
  MagicSchoolBadge, 
  CreatureTypeBadge,
  SizeBadge
} from "./index"
import { 
  DndBadgeType, 
  AbilityScore, 
  Condition, 
  DamageType, 
  MagicSchool, 
  CreatureType,
  CreatureSize
} from "./types"

export interface DndBadgeProps {
  badgeType: DndBadgeType
  value?: string | number
  showLabel?: boolean
  className?: string
}

export function DndBadge({ badgeType, value, showLabel = true, className, ...props }: DndBadgeProps) {
  // Type guards to determine which specific badge to use
  const isAbilityScore = (type: DndBadgeType): type is AbilityScore => 
    ["str", "dex", "con", "int", "wis", "cha"].includes(type)
  
  const isCondition = (type: DndBadgeType): type is Condition => 
    ["blinded", "charmed", "deafened", "exhaustion", "frightened", "grappled", 
     "incapacitated", "invisible", "paralyzed", "petrified", "poisoned", 
     "prone", "restrained", "stunned", "unconscious"].includes(type)
  
  const isDamageType = (type: DndBadgeType): type is DamageType => 
    ["acid", "cold", "fire", "force", "lightning", "necrotic", "poison", 
     "psychic", "radiant", "thunder", "bludgeoning", "piercing", "slashing"].includes(type)
  
  const isMagicSchool = (type: DndBadgeType): type is MagicSchool => 
    ["abjuration", "conjuration", "divination", "enchantment", "evocation", 
     "illusion", "necromancy", "transmutation"].includes(type)
  
  const isCreatureType = (type: DndBadgeType): type is CreatureType => 
    ["aberration", "beast", "celestial", "construct", "dragon", "elemental", 
     "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"].includes(type)
  
  const isCreatureSize = (type: DndBadgeType): type is CreatureSize => 
    ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"].includes(type)

  // Route to appropriate badge component
  if (isAbilityScore(badgeType)) {
    return (
      <AbilityBadge 
        ability={badgeType} 
        modifier={typeof value === "number" ? value : undefined}
        showLabel={showLabel}
        className={className}
        {...props}
      />
    )
  }
  
  if (isCondition(badgeType)) {
    return (
      <ConditionBadge 
        condition={badgeType}
        showLabel={showLabel}
        className={className}
        {...props}
      />
    )
  }
  
  if (isDamageType(badgeType)) {
    return (
      <DamageBadge 
        damageType={badgeType}
        amount={value}
        showLabel={showLabel}
        className={className}
        {...props}
      />
    )
  }
  
  if (isMagicSchool(badgeType)) {
    return (
      <MagicSchoolBadge 
        school={badgeType}
        level={typeof value === "number" ? value : undefined}
        showLabel={showLabel}
        className={className}
        {...props}
      />
    )
  }
  
  if (isCreatureType(badgeType)) {
    return (
      <CreatureTypeBadge 
        creatureType={badgeType}
        showLabel={showLabel}
        className={className}
        {...props}
      />
    )
  }
  
  if (isCreatureSize(badgeType)) {
    return (
      <SizeBadge 
        size={badgeType}
        showFullLabel={showLabel}
        className={className}
        {...props}
      />
    )
  }

  // Fallback - shouldn't happen with proper typing
  return null
} 