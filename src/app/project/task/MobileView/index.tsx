/** @format */

"use client";

import {
  Plus,
  Search,
  Calendar,
  Clock,
  ListTodo,
  Pencil,
  Trash,
  SlidersHorizontal,
  Cloud,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../Laptop/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { CalendarDialog } from "@/components/ui/calendar-dialog";
import { useTaskViewModel } from "../useViewModel";
import { TaskStatus, Task } from "@/types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Editor = dynamic(() => import("../../editor"), {
  ssr: false,
});

export default function MobileTaskView() {
  const {
    searchTerm,
    filter,
    setSearchTerm,
    setFilter,
    paginatedTasks,
    addOrUpdateTask,
    setNewTask,
    setDueDate,
    newTask,
    dueDate,
    dialogOpen: sheetOpen,
    setDialogOpen: setSheetOpen,
    selectedTask,
    setSelectedTask,
    detailsOpen,
    setDetailsOpen,
    updateTaskStatus,
    handleTaskDueDateChange,
    currentEditorData,
    addNote,
    startEditingTask,
    deleteTaskHandler,
    sortBy,
    sortType,
    setSortBy,
    setSortType,
    isSaving,
    getLastSavedText,
    triggerManualSave,
  } = useTaskViewModel();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  useEffect(() => {
    setViewportHeight(window.visualViewport?.height || window.innerHeight);
    const handleResize = () => {
      const viewport = window.visualViewport;
      if (viewport) {
        setViewportHeight(viewport.height);
        setIsKeyboardOpen(viewport.height < window.innerHeight * 0.75);
      }
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    return () =>
      window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTaskHandler(taskToDelete);
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
      setDetailsOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex-none bg-white px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-blue-500" />
            Task Manager
          </h1>
          <button
            onClick={triggerManualSave}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors py-1 px-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title={isSaving ? "Saving..." : "Click to save manually"}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-500 animate-bounce" />
                <span>Saving changes...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-green-500" />
                <span>{getLastSavedText()}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filter Section - Fixed */}
      <div className="flex-none bg-gray-50 px-4 py-3 space-y-3 border-b">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => setIsSortDialogOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={filter}
          onValueChange={(value: TaskStatus | "All") => setFilter(value)}
        >
          <SelectTrigger className="w-full">
            {filter === "All" ? "All Tasks" : filter}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Tasks</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-background">
        {paginatedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 px-4">
            {searchTerm || filter !== "All"
              ? "No tasks match your search criteria."
              : "No tasks yet. Click the + button to add your first task!"}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginatedTasks.map((task) => (
              <div
                key={task.id}
                className="group active:bg-accent/50 transition-colors"
                onClick={() => handleCardClick(task)}
              >
                <div className="px-4 py-3 flex items-start gap-3">
                  <div
                    className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      task.status === "Completed"
                        ? "bg-green-500"
                        : task.status === "In Progress"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        task.status === "Completed"
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {task.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(task.dueDate), "MMM d")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(task.createdAt), "MMM d")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <StatusBadge status={task.status} className="scale-90" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[400px] px-6 rounded-t-[20px] pt-6 border-t-0"
          style={{
            maxHeight: isKeyboardOpen ? `${viewportHeight}px` : "400px",
            transform: isKeyboardOpen ? "translateY(0)" : undefined,
          }}
        >
          <SheetHeader className="mb-2">
            <SheetTitle>Add New Task</SheetTitle>
          </SheetHeader>
          <form onSubmit={addOrUpdateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Task Description</Label>
              <Input
                id="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter your task"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <CalendarDialog
                value={dueDate ? new Date(dueDate) : undefined}
                onChange={(date) =>
                  setDueDate(date ? date.toISOString().split("T")[0] : "")
                }
              />
            </div>
            <Button type="submit" className="w-full mt-6">
              Add Task
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent
          side="bottom"
          className="h-[90vh] px-6 rounded-t-[20px] pt-6 border-t-0"
          style={{
            height: isKeyboardOpen ? `${viewportHeight}px` : "90vh",
            transform: isKeyboardOpen ? "translateY(0)" : undefined,
          }}
        >
          {selectedTask && (
            <>
              <SheetHeader className="mb-0 px-2">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-xl">
                    {selectedTask.text}
                  </SheetTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingTask(selectedTask);
                      }}
                      className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, selectedTask.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-1"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Created:{" "}
                    {format(new Date(selectedTask.createdAt), "MMM d, yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-4 py-4">
                  <div className="space-y-2 w-1/2">
                    <h3 className="font-medium mb-2">Status</h3>
                    <Select
                      value={selectedTask.status}
                      onValueChange={(value: TaskStatus) =>
                        updateTaskStatus(selectedTask.id, value)
                      }
                    >
                      <SelectTrigger>
                        <StatusBadge status={selectedTask.status} />
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
                  <div className="space-y-2 w-1/2">
                    <h3 className="font-medium mb-2">Due Date</h3>
                    <CalendarDialog
                      value={
                        selectedTask.dueDate
                          ? new Date(selectedTask.dueDate)
                          : undefined
                      }
                      onChange={(date) =>
                        handleTaskDueDateChange(selectedTask.id, date)
                      }
                    />
                  </div>
                </div>
              </SheetHeader>
              <div
                className="px-0 space-y-4 overflow-y-auto mt-0"
                style={{
                  height: isKeyboardOpen
                    ? `${viewportHeight - 180}px`
                    : "calc(100vh - 380px)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Notes
                    </h3>
                  </div>

                  <Editor
                    initialData={currentEditorData}
                    onChange={(data) => {
                      if (data) {
                        addNote(selectedTask.id, data);
                      }
                    }}
                  />
                </div>
              </div>

              {!isKeyboardOpen && <div className="flex gap-2 mt-6 px-6"></div>}
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Sort Dialog */}
      <Dialog open={isSortDialogOpen} onOpenChange={setIsSortDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sort Tasks</DialogTitle>
            <DialogDescription>
              Choose how you want to sort your tasks
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Sort by</Label>
              <Select
                value={sortBy}
                onValueChange={(value: typeof sortBy) => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue>
                    {sortBy === "text"
                      ? "Task Name"
                      : sortBy === "createdAt"
                      ? "Created Date"
                      : "Due Date"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Task Name</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Select
                value={sortType}
                onValueChange={(value: typeof sortType) => setSortType(value)}
              >
                <SelectTrigger>
                  <SelectValue>
                    {sortType === "asc" ? "Ascending" : "Descending"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSortBy("createdAt");
                setSortType("desc");
                setIsSortDialogOpen(false);
              }}
            >
              Clear Sort
            </Button>
            <Button onClick={() => setIsSortDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
