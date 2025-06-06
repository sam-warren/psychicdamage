import { useSortable } from "@dnd-kit/sortable";
import { IconGripVertical } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

interface DragHandleProps {
  id: string;
}

export function DragHandle({ id }: DragHandleProps) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
} 