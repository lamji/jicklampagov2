/** @format */
"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Clock,
  Trash,
  Calendar,
  Search,
  Pencil,
  ListTodo,
  ArrowLeft,
  Cloud,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import TaskDetails from "./TaskDetails";
import { StatusBadge, TaskStatus } from "./StatusBadge";
import { OutputData } from "@editorjs/editorjs";
import { Task, TaskNote } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { addTask, deleteTask, updateTask } from "@/lib/store";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const truncateText = (text: string, maxLength: number = 20) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export default function TaskManager() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<TaskStatus | "All">("All");
  const [dueDate, setDueDate] = useState<string>("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Simulate API call for auto-saving
  const simulateAutoSave = useCallback(async () => {
    setIsSaving(true);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setLastSaved(new Date());
  }, []);

  // Format the last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return "All changes saved";
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `Saved ${minutes}m ago`;
    }
    return `Saved ${seconds}s ago`;
  };

  const resetForm = () => {
    setNewTask("");
    setDueDate("");
    setEditingTask(null);
    setDialogOpen(false);
  };

  const addOrUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    if (editingTask) {
      const updatedTask = {
        ...editingTask,
        text: newTask,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      };
      dispatch(updateTask(updatedTask));
      simulateAutoSave();
    } else {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        status: "Not Started",
        createdAt: new Date().toISOString(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        completedAt: undefined,
      };
      dispatch(addTask(task));
      simulateAutoSave();
    }
    resetForm();
  };

  const startEditingTask = (task: Task) => {
    setEditingTask(task);
    setNewTask(task.text);
    const date = task.dueDate ? new Date(task.dueDate) : undefined;
    const dateOnly = date?.toISOString().split("T")[0]; // "2025-04-30"
    console.log(task.dueDate, dateOnly);
    setDueDate(dateOnly || "");
    setDialogOpen(true);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (taskToUpdate) {
      const taskWithNewStatus = {
        ...taskToUpdate,
        status,
        completedAt:
          status === "Completed" ? new Date().toISOString() : undefined,
      };
      dispatch(updateTask(taskWithNewStatus));
      simulateAutoSave();
    }
  };

  const deleteTaskHandler = (id: string) => {
    dispatch(deleteTask(id));
    simulateAutoSave();
  };

  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch = task.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  const triggerManualSave = () => {
    if (!isSaving) {
      simulateAutoSave();
    }
  };

  const updateTaskDueDate = (taskId: string, date: Date | undefined) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        dueDate: date ? date.toISOString() : undefined,
      };
      dispatch(updateTask(updatedTask));
      simulateAutoSave();
    }
  };

  const addNote = (
    taskId: string,
    content: OutputData,
    type: TaskNote["type"] = "paragraph"
  ) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        notes: {
          id: Date.now().toString(),
          content,
          createdAt: new Date().toISOString(),
          isPinned: false,
          type,
        },
      };
      dispatch(updateTask(updatedTask));
      simulateAutoSave();
    }
  };

  console.log(tasks);

  return (
    <div className="min-h-screen bg-gray-50 py-3 px-4 sm:px-6 lg:px-4">
      <div className="mb-4">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1"
        >
          <ArrowLeft className="w-10 h-4" />
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-lg transition-shadow hover:shadow-xl">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-left text-gray-900 flex items-center gap-2">
              <ListTodo className="h-7 w-7 text-blue-500" />
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
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select
              value={filter}
              onValueChange={(value: TaskStatus | "All") => setFilter(value)}
            >
              <SelectTrigger className="w-[180px]">{filter}</SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6 border-gray-200 ">
          <div className="h-[60vh] overflow-y-scroll">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Task
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <p className="text-gray-500">
                          {searchTerm || filter !== "All"
                            ? "No tasks match your search criteria."
                            : "No tasks yet. Click the + button to add your first task!"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        onClick={() => {
                          setSelectedTask(task);
                          setDetailsOpen(true);
                        }}
                      >
                        <td className="w-40 px-6 py-1 whitespace-nowrap">
                          <Select
                            value={task.status}
                            onValueChange={(value: TaskStatus) => {
                              updateTaskStatus(task.id, value);
                            }}
                            onOpenChange={(open) => {
                              if (open) {
                                // Prevent row click when opening select
                                event?.preventDefault();
                                event?.stopPropagation();
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <StatusBadge status={task.status} />
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
                        </td>
                        <td className="px-6 py-1">
                          <span
                            className={
                              task.status === "Completed"
                                ? "line-through text-gray-500"
                                : ""
                            }
                            title={task.text} // Show full text on hover
                          >
                            {truncateText(task.text)}
                          </span>
                        </td>
                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                          {task.dueDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {format(new Date(task.createdAt), "MMM d, yyyy")}
                          </div>
                        </td>
                        <td className="px-6 py-1 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingTask(task);
                              }}
                              className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTaskHandler(task.id);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-1"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredTasks.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {tasks.filter((t: Task) => t.status === "Completed").length} of{" "}
                {tasks.length} tasks completed
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TaskDetails
        isOpen={detailsOpen}
        onOpenChange={setDetailsOpen}
        task={selectedTask}
        onUpdateDueDate={updateTaskDueDate}
        onUpdateStatus={updateTaskStatus}
        onAddNote={addNote}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed right-8 bottom-8 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Edit your task details below."
                : "Enter your task details below. Press Enter or click Add Task when you're done."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={addOrUpdateTask} className="mt-4 space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task description..."
                className="w-full"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="dueDate"
                className="text-sm font-medium text-gray-700"
              >
                Due Date (optional)
              </label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setDueDate(e.target.value);
                  }}
                  className="w-full pl-10"
                  min={new Date().toISOString().split("T")[0]}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingTask ? "Save Changes" : "Add Task"}
              </Button>
              {editingTask && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
