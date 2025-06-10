import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Tables } from "@/types/database"
import { DndBadge } from "../molecules/badges/dnd-badge"
import {
  Alignment,
  CreatureSize,
  CreatureType,
  AbilityScore,
} from "../molecules/badges/types"
import {
  formatAbilityScore,
  formatDice,
  formatMovementText,
  formatNumber,
  formatSkillsText,
  formatSensesText,
} from "@/lib/utils/monster-formatting"

type Monster = Tables<"monsters">

interface MonsterStatSheetProps {
  monster: Monster
}

export function MonsterStatSheet({ monster }: MonsterStatSheetProps) {
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
      <DrawerContent className="max-w-5xl mx-auto px-4">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="text-2xl font-bold">
            {monster.name}
          </DrawerTitle>
          <DrawerDescription className="text-base">
            <DndBadge
              badgeType={monster.size as CreatureSize}
              className="mr-2"
            />
            <DndBadge
              badgeType={monster.type as CreatureType}
              className="mr-2"
            />
            <DndBadge
              badgeType={monster.alignment as Alignment}
              className="mr-2"
            />
            {monster.subtype && ` (${monster.subtype})`}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-6 text-sm max-h-[80vh]">
          {/* Basic Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
                BASIC STATS
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <strong className="text-foreground">Armor Class:</strong>
                  {monster.armor_class
                    ? formatNumber(monster.armor_class)
                    : "—"}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-foreground">Hit Points:</strong>
                  {monster.hit_points ? formatNumber(monster.hit_points) : "—"}
                  {monster.hit_dice && (
                    <span className="ml-1">{formatDice(monster.hit_dice)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-foreground">Challenge Rating:</strong>
                  {monster.challenge_rating
                    ? formatNumber(monster.challenge_rating)
                    : "—"}
                  <span className="text-muted-foreground">
                    (
                    {monster.xp ? (
                      <span className="font-mono text-foreground">
                        {monster.xp}
                      </span>
                    ) : (
                      "—"
                    )}{" "}
                    XP)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground border-b border-border pb-1 mb-2">
                MOVEMENT
              </h3>
              <div className="space-y-1">
                {speed.raw ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMovementText(speed.raw),
                    }}
                  />
                ) : (
                  <div>—</div>
                )}
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
                  <div
                    key={ability}
                    className="border border-border rounded p-2 bg-card"
                  >
                    <DndBadge
                      badgeType={ability.toLowerCase() as AbilityScore}
                      className="mb-1"
                    />
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
              <div className="space-y-2">
                {skills.raw && (
                  <div>
                    <strong className="text-foreground">Skills:</strong>
                    <span
                      className="ml-1"
                      dangerouslySetInnerHTML={{
                        __html: formatSkillsText(skills.raw),
                      }}
                    />
                  </div>
                )}
                {monster.damage_resistances &&
                  monster.damage_resistances.length > 0 && (
                    <div>
                      <strong className="text-foreground">
                        Damage Resistances:
                      </strong>{" "}
                      <span className="text-foreground">
                        {monster.damage_resistances.join(", ")}
                      </span>
                    </div>
                  )}
                {monster.damage_immunities &&
                  monster.damage_immunities.length > 0 && (
                    <div>
                      <strong className="text-foreground">
                        Damage Immunities:
                      </strong>{" "}
                      <span className="text-foreground">
                        {monster.damage_immunities.join(", ")}
                      </span>
                    </div>
                  )}
                {monster.condition_immunities &&
                  monster.condition_immunities.length > 0 && (
                    <div>
                      <strong className="text-foreground">
                        Condition Immunities:
                      </strong>{" "}
                      <span className="text-foreground">
                        {monster.condition_immunities.join(", ")}
                      </span>
                    </div>
                  )}
                {monster.damage_vulnerabilities &&
                  monster.damage_vulnerabilities.length > 0 && (
                    <div>
                      <strong className="text-foreground">
                        Damage Vulnerabilities:
                      </strong>{" "}
                      <span className="text-foreground">
                        {monster.damage_vulnerabilities.join(", ")}
                      </span>
                    </div>
                  )}
                {monster.senses && (
                  <div>
                    <strong className="text-foreground">Senses:</strong>
                    <span
                      className="ml-1"
                      dangerouslySetInnerHTML={{
                        __html: formatSensesText(monster.senses),
                      }}
                    />
                  </div>
                )}
                {monster.languages && (
                  <div>
                    <strong className="text-foreground">Languages:</strong>{" "}
                    <span className="text-foreground">{monster.languages}</span>
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
                    <div className="font-semibold text-foreground mb-2">
                      {ability.name}
                    </div>
                    <Textarea
                      value={ability.description.replace(/<[^>]*>/g, '')}
                      readOnly
                      className="resize-none min-h-[60px] text-sm bg-card/50 border-border/50"
                    />
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
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <div className="font-semibold text-lg text-foreground">
                        {action.name}
                      </div>
                      {action.to_hit && (
                        <>
                          {formatNumber(action.to_hit)} to hit
                          <span className="mx-1">•</span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: formatMovementText(
                                action.reach || "5 ft."
                              ),
                            }} 
                          /> reach
                          {action.damage_dice && (
                            <>
                              <span className="mx-1">•</span>
                              {formatDice(action.damage_dice)}
                              <span className="ml-1">{action.damage_type}</span>
                              {action.extra_damage_dice && (
                                <>
                                  <span className="mx-1">+</span>
                                  {formatDice(action.extra_damage_dice)}
                                  <span className="ml-1">
                                    {action.extra_damage_type}
                                  </span>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <Textarea
                      value={action.description.replace(/<[^>]*>/g, '')}
                      readOnly
                      className="resize-none min-h-[60px] text-sm bg-card/50 border-border/50"
                    />
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
                    <div className="font-semibold text-foreground mb-2">
                      {action.name}
                    </div>
                    <Textarea
                      value={action.description.replace(/<[^>]*>/g, '')}
                      readOnly
                      className="resize-none min-h-[60px] text-sm bg-card/50 border-border/50"
                    />
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
