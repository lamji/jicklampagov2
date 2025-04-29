/** @format */
"use client";

import * as React from "react";
import { useState } from "react";
import { OutputData } from "@editorjs/editorjs";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, TaskStatus } from "@/app/project/task/StatusBadge";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import dynamic from "next/dynamic";
import { Task } from "@/types";

const Editor = dynamic(() => import("../editor"), {
  ssr: false,
});

interface TaskDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onUpdateDueDate: (taskId: string, date: Date | undefined) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onAddNote: (taskId: string, content: OutputData) => void;
  onPinNote?: (taskId: string, noteId: string) => void;
}

export default function TaskDetails({
  isOpen,
  onOpenChange,
  task,
  onUpdateDueDate,
  onUpdateStatus,
  onAddNote,
}: TaskDetailsProps) {
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(
    task?.status || "Not Started"
  );
  const [editorData, setEditorData] = useState<OutputData>({
    time: Date.now(),
    blocks: [],
  });

  const handleStatusChange = (status: TaskStatus) => {
    setCurrentStatus(status);
    if (task) {
      onUpdateStatus(task.id, status);
    }
  };

  // Add a utility function to format dates
  const formatDate = (isoString: string | undefined) => {
    if (!isoString) return "";
    return format(new Date(isoString), "MMMM d, yyyy");
  };

  React.useEffect(() => {
    const contentData = {
      time: task?.notes?.content?.time || Date.now(),
      blocks: task?.notes?.content?.blocks || [],
      version: task?.notes?.content?.version || "",
    };
    setEditorData(contentData);
  }, [task]);

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
                  value={currentStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <StatusBadge status={currentStatus ?? "Not Started"} />
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
                    value={task.dueDate ? task.dueDate.split("T")[0] : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUpdateDueDate(
                        task.id,
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
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
              initialData={editorData}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
