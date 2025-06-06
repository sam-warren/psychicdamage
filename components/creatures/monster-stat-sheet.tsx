import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Tables } from "@/types/database"

type Monster = Tables<"monsters">

interface MonsterStatSheetProps {
  monster: Monster
}

export function MonsterStatSheet({ monster }: MonsterStatSheetProps) {
  // Helper function to format ability scores
  const formatAbilityScore = (score: number) => {
    const modifier = Math.floor((score - 10) / 2)
    return `${score} (${modifier >= 0 ? "+" : ""}${modifier})`
  }

  // Parse JSON fields safely based on actual database structure
  const abilityScores = (monster.ability_scores as Record<string, string>) || {}
  const skills = (monster.skills as { raw?: string }) || {}
  const speed = (monster.speed as { raw?: string }) || {}
  const allActions =
    (monster.actions as Array<{
      name: string
      description: string
      reach?: string
      to_hit?: string
      damage_dice?: string
      damage_type?: string
      extra_damage_dice?: string
      extra_damage_type?: string
      saving_throw?: string
    }>) || []
  const specialAbilities =
    (monster.special_abilities as Array<{
      name: string
      description: string
    }>) || []
  const legendaryActions =
    (monster.legendary_actions as Array<{
      name: string
      description: string
    }>) || []

  // Separate regular actions from legendary actions within the actions array
  const regularActions = allActions.filter(
    (action) =>
      !action.description.toLowerCase().includes("legendary action") &&
      !action.name.toLowerCase().includes("costs") &&
      !["Detect", "Tail Swipe", "Psychic Drain"].some((legendary) =>
        action.name.includes(legendary)
      )
  )

  return (
    <Drawer direction={"bottom"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {monster.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-5xl mx-auto">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="text-2xl font-bold">
            {monster.name}
          </DrawerTitle>
          <DrawerDescription className="text-base">
            {monster.size} {monster.type}
            {monster.subtype && ` (${monster.subtype})`}, {monster.alignment}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-6 text-sm max-h-[80vh]">
          {/* Basic Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
                BASIC STATS
              </h3>
              <div className="space-y-1">
                <div>
                  <strong>Armor Class:</strong> {monster.armor_class || "—"}
                </div>
                <div>
                  <strong>Hit Points:</strong> {monster.hit_points || "—"}{" "}
                  {monster.hit_dice && `(${monster.hit_dice})`}
                </div>
                <div>
                  <strong>Challenge Rating:</strong>{" "}
                  {monster.challenge_rating || "—"} ({monster.xp || "—"} XP)
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
                MOVEMENT
              </h3>
              <div className="space-y-1">
                {speed.raw ? <div>{speed.raw}</div> : <div>—</div>}
              </div>
            </div>
          </div>

          {/* Ability Scores */}
          <div>
            <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
              ABILITY SCORES
            </h3>
            <div className="grid grid-cols-6 gap-2 text-center">
              {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((ability) => {
                const score =
                  parseInt(abilityScores[ability.toLowerCase()]) || 10
                return (
                  <div key={ability} className="border rounded p-2">
                    <div className="font-semibold text-xs">{ability}</div>
                    <div className="text-sm">{formatAbilityScore(score)}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Skills, Resistances, etc. */}
          {(skills.raw ||
            monster.damage_resistances ||
            monster.damage_immunities ||
            monster.condition_immunities ||
            monster.damage_vulnerabilities ||
            monster.senses ||
            monster.languages) && (
            <div>
              <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
                DEFENSES & SENSES
              </h3>
              <div className="space-y-1">
                {skills.raw && (
                  <div>
                    <strong>Skills:</strong> {skills.raw}
                  </div>
                )}
                {monster.damage_resistances &&
                  monster.damage_resistances.length > 0 && (
                    <div>
                      <strong>Damage Resistances:</strong>{" "}
                      {monster.damage_resistances.join(", ")}
                    </div>
                  )}
                {monster.damage_immunities &&
                  monster.damage_immunities.length > 0 && (
                    <div>
                      <strong>Damage Immunities:</strong>{" "}
                      {monster.damage_immunities.join(", ")}
                    </div>
                  )}
                {monster.condition_immunities &&
                  monster.condition_immunities.length > 0 && (
                    <div>
                      <strong>Condition Immunities:</strong>{" "}
                      {monster.condition_immunities.join(", ")}
                    </div>
                  )}
                {monster.damage_vulnerabilities &&
                  monster.damage_vulnerabilities.length > 0 && (
                    <div>
                      <strong>Damage Vulnerabilities:</strong>{" "}
                      {monster.damage_vulnerabilities.join(", ")}
                    </div>
                  )}
                {monster.senses && (
                  <div>
                    <strong>Senses:</strong> {monster.senses}
                  </div>
                )}
                {monster.languages && (
                  <div>
                    <strong>Languages:</strong> {monster.languages}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special Abilities */}
          {specialAbilities.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
                SPECIAL ABILITIES
              </h3>
              <div className="space-y-3">
                {specialAbilities.map((ability, index: number) => (
                  <div key={index}>
                    <div className="font-semibold">{ability.name}</div>
                    <div className="text-muted-foreground">
                      {ability.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {regularActions.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
                ACTIONS
              </h3>
              <div className="space-y-3">
                {regularActions.map((action, index: number) => (
                  <div key={index}>
                    <div className="font-semibold">{action.name}</div>
                    <div className="text-muted-foreground">
                      {action.description}
                    </div>
                    {action.to_hit && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Attack: {action.to_hit} to hit, reach{" "}
                        {action.reach || "5 ft."} | Damage: {action.damage_dice}{" "}
                        {action.damage_type}
                        {action.extra_damage_dice &&
                          ` + ${action.extra_damage_dice} ${action.extra_damage_type}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legendary Actions */}
          {legendaryActions.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
                LEGENDARY ACTIONS
              </h3>
              <div className="space-y-3">
                {legendaryActions.map((action, index: number) => (
                  <div key={index}>
                    <div className="font-semibold">{action.name}</div>
                    <div className="text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              <strong>Source:</strong> {monster.source}
              {monster.is_homebrew && (
                <Badge variant="default" className="ml-2 text-xs">
                  Homebrew
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
