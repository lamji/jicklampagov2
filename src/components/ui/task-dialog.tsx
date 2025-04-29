/** @format */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";

interface TaskDialogProps {
  title: string;
  description: string;
  dueDate?: string;
  status: string;
}

export function TaskDialog({
  title,
  description,
  dueDate,
  status,
}: TaskDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Status</h4>
            <p className="text-sm">
              {status === "completed" ? "✅ Completed" : "⏳ Pending"}
            </p>
          </div>
          {dueDate && (
            <div className="space-y-2">
              <h4 className="font-medium">Due Date</h4>
              <p className="text-sm">{dueDate}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
