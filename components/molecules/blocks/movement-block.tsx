import { formatMovementText } from "@/lib/utils/monster-formatting"

interface MovementBlockProps {
  speed: { raw: string }
}

export function MovementBlock({ speed }: MovementBlockProps) {
  return (
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
  )
}
