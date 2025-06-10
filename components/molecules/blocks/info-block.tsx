import { MovementBlock } from "./movement-block"
import { StatBlock } from "./stat-block"
import { Tables } from "@/types/database"
import { AbilitiesBlock } from "./ability-block"

export function InfoBlock({ creature }: { creature: Tables<"monsters"> }) {
  const abilityScores =
    (creature.ability_scores as Record<string, string>) || {}
  const speed = (creature.speed as { raw?: string }) || {}

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <StatBlock creature={creature} />

        <MovementBlock speed={speed as { raw: string }} />
      </div>

      <div>
        <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
          ABILITY SCORES
        </h3>
        <AbilitiesBlock abilityScores={abilityScores} />
      </div>
    </>
  )
}
