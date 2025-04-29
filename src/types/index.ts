/** @format */

import { OutputData } from "@editorjs/editorjs";

export type TaskStatus = "Not Started" | "In Progress" | "Completed";

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  notes?: TaskNote;
}

export interface TaskNote {
  id: string;
  content: OutputData;
  createdAt: string;
  isPinned: boolean;
  type: "paragraph" | "checklist" | "header";
}
