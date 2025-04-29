/** @format */

"use client";

import * as React from "react";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContentEditable } from "./contenteditable";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  GripVertical,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  TextIcon,
} from "lucide-react";

interface Block {
  id: string;
  content: string;
  type: "paragraph" | "heading1" | "heading2" | "bullet" | "numbered";
}

interface BlockEditorProps {
  className?: string;
  initialBlocks?: Block[];
  onChange?: (blocks: Block[]) => void;
}

const BLOCK_TYPES = [
  {
    type: "paragraph",
    label: "Text",
    icon: TextIcon,
  },
  {
    type: "heading1",
    label: "Heading 1",
    icon: Heading1,
  },
  {
    type: "heading2",
    label: "Heading 2",
    icon: Heading2,
  },
  {
    type: "bullet",
    label: "Bullet List",
    icon: List,
  },
  {
    type: "numbered",
    label: "Numbered List",
    icon: ListOrdered,
  },
] as const;

function SortableBlock({
  block,
  ...props
}: { block: Block } & React.ComponentProps<typeof ContentEditable>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={cn("group relative", isDragging && "z-50")}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 px-3 py-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <ContentEditable {...props} />
    </motion.div>
  );
}

export function BlockEditor({
  className,
  initialBlocks,
  onChange,
}: BlockEditorProps) {
  const [blocks, setBlocks] = React.useState<Block[]>(
    initialBlocks || [{ id: nanoid(), content: "", type: "paragraph" }]
  );
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(
    blocks[0]?.id || null
  );
  const [showCommands, setShowCommands] = React.useState(false);
  const [commandPosition, setCommandPosition] = React.useState({
    top: 0,
    left: 0,
  });

  // Auto-focus first block on mount
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current && blocks[0]) {
      firstRender.current = false;
      const firstBlock = document.querySelector(
        `[data-block-id="${blocks[0].id}"]`
      ) as HTMLElement;
      if (firstBlock) {
        firstBlock.focus();
      }
    }
  }, [blocks]);

  const updateBlockType = (id: string, type: Block["type"]) => {
    setBlocks((blocks) =>
      blocks.map((block) =>
        block.id === id
          ? { ...block, type, content: block.content.replace("/", "") }
          : block
      )
    );
    setShowCommands(false);
  };

  const updateBlock = (id: string, content: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === id);
    const block = blocks[blockIndex];

    if (content.startsWith("/") && block.content === "") {
      setShowCommands(true);
      const element = document.querySelector(`[data-block-id="${id}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCommandPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
      return;
    }

    setBlocks((blocks) =>
      blocks.map((block) => (block.id === id ? { ...block, content } : block))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === blockId);
    const block = blocks[blockIndex];

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newBlock = {
        id: nanoid(),
        content: "",
        type: "paragraph" as const,
      };
      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, newBlock);
      setBlocks(newBlocks);
      setActiveBlockId(newBlock.id);
    }

    if (e.key === "Backspace" && block.content === "" && blocks.length > 1) {
      e.preventDefault();
      const newBlocks = blocks.filter((b) => b.id !== blockId);
      setBlocks(newBlocks);
      setActiveBlockId(
        blocks[blockIndex - 1]?.id || blocks[blockIndex + 1]?.id || null
      );
    }

    if (e.key === "Escape") {
      setShowCommands(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);

        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };

  React.useEffect(() => {
    onChange?.(blocks);
  }, [blocks, onChange]);

  // Persist to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("blocks", JSON.stringify(blocks));
    }
  }, [blocks]);

  // Load from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined" && !initialBlocks) {
      const savedBlocks = localStorage.getItem("blocks");
      if (savedBlocks) {
        const parsedBlocks = JSON.parse(savedBlocks);
        setBlocks(parsedBlocks);
        setActiveBlockId(parsedBlocks[0]?.id || null);
      }
    }
  }, [initialBlocks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("space-y-4", className)}>
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                value={block.content}
                onValueChange={(content) => updateBlock(block.id, content)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                placeholder={block.content ? "" : "Type / for commands"}
                className={cn(
                  "w-full min-h-[42px] outline-none",
                  "focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded-md",
                  block.type === "heading1" && "text-4xl font-bold",
                  block.type === "heading2" && "text-2xl font-semibold",
                  block.type === "bullet" &&
                    "pl-6 relative before:content-['•'] before:absolute before:left-2 before:top-1",
                  block.type === "numbered" && "pl-6"
                )}
                data-block-id={block.id}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </div>

      {/* Command menu */}
      {showCommands && activeBlockId && (
        <div
          className="fixed z-50 w-64"
          style={{
            top: commandPosition.top + "px",
            left: commandPosition.left + "px",
          }}
        >
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              <CommandGroup heading="Basic blocks">
                {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                  <CommandItem
                    key={type}
                    onSelect={() => updateBlockType(activeBlockId, type)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </DndContext>
  );
}
