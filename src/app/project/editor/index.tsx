/** @format */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import EditorJS, {
  OutputData,
  BlockToolConstructable,
} from "@editorjs/editorjs";

interface EditorProps {
  initialData?: OutputData;
  onChange?: (data: OutputData) => void;
}

export default function Editor({ initialData, onChange }: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedOnChange = useCallback(
    async (editor: EditorJS) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const data = await editor.save();
          onChange?.(data);
        } catch (error) {
          console.error("Failed to save editor data:", error);
        }
      }, 500); // 500ms delay
    },
    [onChange]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const holder = holderRef.current;

    const initializeEditor = async () => {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Paragraph = (await import("@editorjs/paragraph")).default;
      const Code = (await import("@editorjs/code")).default;
      const Checklist = (await import("@editorjs/checklist")).default;

      // Only initialize if we don't already have an editor instance
      if (!holder || editorRef.current) return;

      const editor = new EditorJS({
        holder: holder,
        tools: {
          header: {
            class: Header as unknown as BlockToolConstructable,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
            },
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+H",
          },
          list: {
            class: List as unknown as BlockToolConstructable,
            inlineToolbar: true,
          },
          paragraph: {
            class: Paragraph as unknown as BlockToolConstructable,
            inlineToolbar: true,
          },
          code: {
            class: Code as unknown as BlockToolConstructable,
          },
          checklist: {
            class: Checklist as unknown as BlockToolConstructable,
            inlineToolbar: true,
          },
        },
        data: initialData || { blocks: [] },
        onChange: async () => {
          try {
            await debouncedOnChange(editor);
          } catch (error) {
            console.error("Error during onChange:", error);
          }
        },
        placeholder: "Type / to start writing...",
        autofocus: true,
        readOnly: false,
        minHeight: 200,
        onReady: () => setIsEditorReady(true),
      });

      editorRef.current = editor;
    };

    if (!editorRef.current) {
      initializeEditor().catch(console.error);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (editorRef.current && !holder) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialData, debouncedOnChange]);

  return (
    <div className="w-full space-y-4">
      <style jsx global>{`
        .ce-toolbar__plus {
          left: -40px !important;
          right: unset !important;
        }
        .ce-toolbar__actions {
          right: unset !important;
          left: -40px !important;
        }
        .ce-block:hover .ce-toolbar__actions {
          left: -40px !important;
        }
        .ce-toolbar--opened {
          left: 0 !important;
        }
        .ce-block--selected .ce-block__content {
          border-radius: 8px !important;
          background: #f8f9fa !important;
        }
        .ce-paragraph.cdx-block:empty:before {
          padding-left: 12px !important;
        }
        .cdx-checklist__item {
          padding-left: 12px !important;
        }
      `}</style>
      <div className="border border-gray-200 rounded-lg py-2">
        <div
          ref={holderRef}
          className="prose max-w-none min-h-[200px] relative ml-10"
        >
          {!isEditorReady && (
            <div className="text-gray-400">Loading editor...</div>
          )}
        </div>
      </div>
    </div>
  );
}
