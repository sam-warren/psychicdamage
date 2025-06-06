// D&D Ability Scores
export type AbilityScore = "str" | "dex" | "con" | "int" | "wis" | "cha"

// D&D Conditions
export type Condition =
  | "blinded"
  | "charmed"
  | "deafened"
  | "exhaustion"
  | "frightened"
  | "grappled"
  | "incapacitated"
  | "invisible"
  | "paralyzed"
  | "petrified"
  | "poisoned"
  | "prone"
  | "restrained"
  | "stunned"
  | "unconscious"

// D&D Damage Types
export type DamageType =
  | "acid"
  | "cold"
  | "fire"
  | "force"
  | "lightning"
  | "necrotic"
  | "poison"
  | "psychic"
  | "radiant"
  | "thunder"
  | "bludgeoning"
  | "piercing"
  | "slashing"

// D&D Schools of Magic
export type MagicSchool =
  | "abjuration"
  | "conjuration"
  | "divination"
  | "enchantment"
  | "evocation"
  | "illusion"
  | "necromancy"
  | "transmutation"

// D&D Creature Types
export type CreatureType =
  | "aberration"
  | "beast"
  | "celestial"
  | "construct"
  | "dragon"
  | "elemental"
  | "fey"
  | "fiend"
  | "giant"
  | "humanoid"
  | "monstrosity"
  | "ooze"
  | "plant"
  | "undead"

// D&D Creature Sizes
export type CreatureSize =
  | "Tiny"
  | "Small"
  | "Medium"
  | "Large"
  | "Huge"
  | "Gargantuan"

export type DndBadgeType =
  | AbilityScore
  | Condition
  | DamageType
  | MagicSchool
  | CreatureType
  | CreatureSize 