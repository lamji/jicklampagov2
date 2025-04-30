/** @format */
"use client";

import * as React from "react";
import { OutputData } from "@editorjs/editorjs";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, TaskStatus } from "@/app/project/task/Laptop/StatusBadge";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { Task } from "@/types";
import { useTaskViewModel } from "../useViewModel";

const Editor = dynamic(() => import("../../editor"), {
  ssr: false,
});

interface TaskDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onAddNote: (taskId: string, content: OutputData) => void;
  onPinNote?: (taskId: string, noteId: string) => void;
}

export default function TaskDetails({
  isOpen,
  onOpenChange,
  task,
  onAddNote,
}: TaskDetailsProps) {
  const {
    currentDetailStatus,
    currentDetailDueDate,
    currentEditorData,
    formatDate,
    handleTaskStatusChange,
    handleTaskDueDateChange,
  } = useTaskViewModel();

  if (!task) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] p-0">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">{task.text}</SheetTitle>
          {task.createdAt && (
            <p className="text-sm text-gray-500">
              Created on {formatDate(task.createdAt)}
            </p>
          )}
          <div className="mt-6">
            <div className="flex gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <Select
                  value={currentDetailStatus}
                  onValueChange={(status: TaskStatus) =>
                    handleTaskStatusChange(task.id, status)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <StatusBadge status={currentDetailStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">
                      <StatusBadge status="Not Started" />
                    </SelectItem>
                    <SelectItem value="In Progress">
                      <StatusBadge status="In Progress" />
                    </SelectItem>
                    <SelectItem value="Completed">
                      <StatusBadge status="Completed" />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                <div className="relative">
                  <Input
                    id="dueDate"
                    type="date"
                    value={currentDetailDueDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newDate = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      handleTaskDueDateChange(task.id, newDate);
                    }}
                    className="w-full pl-10"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>
        <div className="px-6 space-y-4 h-[calc(100vh-120px)] overflow-y-auto">
          <Separator className="mb-4" />
          <div className="">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Notes
              </h3>
            </div>

            <Editor
              onChange={(data) => {
                if (data) {
                  onAddNote(task.id, data);
                }
              }}
              initialData={currentEditorData}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
