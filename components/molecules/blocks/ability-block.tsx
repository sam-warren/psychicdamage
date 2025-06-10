import { DndBadge } from "../badges/dnd-badge"
import { AbilityScore } from "../badges/types"
import { formatAbilityScore } from "@/lib/utils/monster-formatting"

interface AbilityBlockProps {
  ability: string
  score: number
}

export function AbilityBlock({ ability, score }: AbilityBlockProps) {
  return (
    <div>
      <DndBadge
        badgeType={ability.toLowerCase() as AbilityScore}
        className="mb-1"
      />
      <div className="text-sm">{formatAbilityScore(score)}</div>
    </div>
  )
}

export function AbilitiesBlock({
  abilityScores,
}: {
  abilityScores: Record<string, string>
}) {
  return (
    <div className="grid grid-cols-6 gap-2 text-center">
      {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((ability) => {
        const score = parseInt(abilityScores[ability.toLowerCase()]) || 10

        return <AbilityBlock key={ability} ability={ability} score={score} />
      })}
    </div>
  )
}
