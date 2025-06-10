import {
  formatDescription,
  formatNumber,
  formatMovementText,
  formatDice,
} from "@/lib/utils/monster-formatting"

type Action = {
  name: string
  description: string
  reach?: string
  to_hit?: string
  damage_dice?: string
  damage_type?: string
  extra_damage_dice?: string
  extra_damage_type?: string
  saving_throw?: string
}

export function ActionBlock({ action }: { action: Action }) {
  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <div className="font-semibold text-lg text-foreground">
          {action.name}
        </div>
        {action.to_hit && (
          <span className="text-sm text-foreground">
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
                    <span className="ml-1">{action.extra_damage_type}</span>
                  </>
                )}
              </>
            )}
          </span>
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
  )
}
