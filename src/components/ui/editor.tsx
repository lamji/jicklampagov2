/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import EditorJS, {
  BlockToolConstructable,
  OutputData,
} from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import { cn } from "@/lib/utils";

export interface EditorProps {
  value?: OutputData;
  onChange?: (value: OutputData) => void;
  placeholder?: string;
  className?: string;
}

export function Editor({
  value,
  onChange,
  placeholder,
  className,
}: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let editor: EditorJS;

    const initEditor = async () => {
      // Initialize editor
      editor = new EditorJS({
        holder: "editor",
        tools: {
          header: {
            class: Header as unknown as BlockToolConstructable,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2],
              defaultLevel: 1,
            },
          },
          list: {
            class: List as unknown as BlockToolConstructable,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          paragraph: {
            class: Paragraph as unknown as BlockToolConstructable,
            inlineToolbar: true,
          },
        },
        data: value,
        placeholder: placeholder || "Type / for commands, or start writing...",
        onChange: async () => {
          const data = await editor.save();
          onChange?.(data);
        },
      });

      editorRef.current = editor;
    };

    initEditor();

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isMounted, onChange, placeholder, value]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      id="editor"
      className={cn(
        "prose prose-gray dark:prose-invert max-w-none",
        "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    />
  );
}
