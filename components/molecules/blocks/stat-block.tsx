import { formatDice, formatNumber } from "@/lib/utils/monster-formatting"
import { Tables } from "@/types/database"

interface StatBlockProps {
  creature: Tables<"monsters">
}

export function StatBlock({ creature }: StatBlockProps) {
  return (
    <div>
      <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
        BASIC STATS
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <strong className="text-foreground">Armor Class:</strong>
          {creature.armor_class ? formatNumber(creature.armor_class) : "—"}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <strong className="text-foreground">Hit Points:</strong>
          {creature.hit_points ? formatNumber(creature.hit_points) : "—"}
          {creature.hit_dice && (
            <span className="ml-1">{formatDice(creature.hit_dice)}</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <strong className="text-foreground">Challenge Rating:</strong>
          {creature.challenge_rating
            ? formatNumber(creature.challenge_rating)
            : "—"}
          <span className="text-muted-foreground">
            (
            {creature.xp ? (
              <span className="font-mono text-foreground">{creature.xp}</span>
            ) : (
              "—"
            )}{" "}
            XP)
          </span>
        </div>
      </div>
    </div>
  )
}
