import { Badge } from "@/components/ui/badge"
import { Tables } from "@/types/database"
import {
  formatDice,
  formatMovementText,
  formatNumber,
  formatSkillsText,
  formatSensesText,
  formatDescription,
} from "@/lib/utils/monster-formatting"
import { Header } from "./components/header"
import { InfoBlock } from "@/components/molecules/blocks/info-block"

type Creature = Tables<"monsters">

interface StatSheetProps {
  creature: Creature
}

export function StatSheet({ creature }: StatSheetProps) {
  // Parse JSON fields safely based on actual database structure
  const skills = (creature.skills as { raw?: string }) || {}
  const allActions =
    (creature.actions as Array<{
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
    (creature.special_abilities as Array<{
      name: string
      description: string
    }>) || []
  const legendaryActions =
    (creature.legendary_actions as Array<{
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
    <>
      <Header creature={creature} />

      <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-6 text-sm max-h-[80vh]">
        <InfoBlock creature={creature} />

        {/* Skills, Resistances, etc. */}
        {(skills.raw ||
          creature.damage_resistances ||
          creature.damage_immunities ||
          creature.condition_immunities ||
          creature.damage_vulnerabilities ||
          creature.senses ||
          creature.languages) && (
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
              {creature.damage_resistances &&
                creature.damage_resistances.length > 0 && (
                  <div>
                    <strong className="text-foreground">
                      Damage Resistances:
                    </strong>{" "}
                    <span className="text-foreground">
                      {creature.damage_resistances.join(", ")}
                    </span>
                  </div>
                )}
              {creature.damage_immunities &&
                creature.damage_immunities.length > 0 && (
                  <div>
                    <strong className="text-foreground">
                      Damage Immunities:
                    </strong>{" "}
                    <span className="text-foreground">
                      {creature.damage_immunities.join(", ")}
                    </span>
                  </div>
                )}
              {creature.condition_immunities &&
                creature.condition_immunities.length > 0 && (
                  <div>
                    <strong className="text-foreground">
                      Condition Immunities:
                    </strong>{" "}
                    <span className="text-foreground">
                      {creature.condition_immunities.join(", ")}
                    </span>
                  </div>
                )}
              {creature.damage_vulnerabilities &&
                creature.damage_vulnerabilities.length > 0 && (
                  <div>
                    <strong className="text-foreground">
                      Damage Vulnerabilities:
                    </strong>{" "}
                    <span className="text-foreground">
                      {creature.damage_vulnerabilities.join(", ")}
                    </span>
                  </div>
                )}
              {creature.senses && (
                <div>
                  <strong className="text-foreground">Senses:</strong>
                  <span
                    className="ml-1"
                    dangerouslySetInnerHTML={{
                      __html: formatSensesText(creature.senses),
                    }}
                  />
                </div>
              )}
              {creature.languages && (
                <div>
                  <strong className="text-foreground">Languages:</strong>{" "}
                  <span className="text-foreground">{creature.languages}</span>
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
                  <div className="bg-card/50 border border-border/50 rounded-md p-3">
                    <span
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(ability.description),
                      }}
                    />
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
                            __html: formatMovementText(action.reach || "5 ft."),
                          }}
                        />{" "}
                        reach
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
                  <div className="bg-card/50 border border-border/50 rounded-md p-3">
                    <span
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(action.description),
                      }}
                    />
                  </div>
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
                  <div className="bg-card/50 border border-border/50 rounded-md p-3">
                    <span
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatDescription(action.description),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            <strong>Source:</strong> {creature.source}
            {creature.is_homebrew && (
              <Badge variant="default" className="ml-2 text-xs">
                Homebrew
              </Badge>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
