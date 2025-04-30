/** @format */
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { addTask, updateTask, deleteTask } from "@/lib/store";
import { Task, TaskStatus, TaskNote } from "@/types";
import { OutputData } from "@editorjs/editorjs";
import { format } from "date-fns";

export function useTaskViewModel() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<TaskStatus | "All">("All");
  const [dueDate, setDueDate] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"text" | "createdAt" | "dueDate">(
    "createdAt"
  );
  const [sortType, setSortType] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 7;

  const simulateAutoSave = useCallback(async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setLastSaved(new Date());
  }, []);

  const getLastSavedText = () => {
    if (!lastSaved) return "All changes saved";
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const seconds = Math.floor(diff / 1000);
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
    const dateOnly = date?.toISOString().split("T")[0];
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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  const sortedAndFilteredTasks = [...filteredTasks].sort((a, b) => {
    const aValue =
      sortBy === "text"
        ? a.text
        : sortBy === "createdAt"
        ? new Date(a.createdAt).getTime()
        : a.dueDate
        ? new Date(a.dueDate).getTime()
        : 0;
    const bValue =
      sortBy === "text"
        ? b.text
        : sortBy === "createdAt"
        ? new Date(b.createdAt).getTime()
        : b.dueDate
        ? new Date(b.dueDate).getTime()
        : 0;

    if (sortBy === "dueDate" && (!a.dueDate || !b.dueDate)) {
      if (!a.dueDate) return sortType === "asc" ? 1 : -1;
      if (!b.dueDate) return sortType === "asc" ? -1 : 1;
    }

    return sortType === "asc"
      ? aValue < bValue
        ? -1
        : 1
      : aValue > bValue
      ? -1
      : 1;
  });

  const totalPages = Math.ceil(sortedAndFilteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = sortedAndFilteredTasks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  const triggerManualSave = () => {
    if (!isSaving) {
      simulateAutoSave();
    }
  };

  const [currentDetailStatus, setCurrentDetailStatus] =
    useState<TaskStatus>("Not Started");
  const [currentDetailDueDate, setCurrentDetailDueDate] = useState<string>("");
  const [currentEditorData, setCurrentEditorData] = useState<OutputData>({
    time: Date.now(),
    blocks: [],
  });

  // TaskDetails-related functions
  const formatDate = (isoString: string | undefined) => {
    if (!isoString) return "";
    return format(new Date(isoString), "MMMM d, yyyy");
  };

  const formatDateForInput = (isoString: string | undefined) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  const handleTaskStatusChange = (taskId: string, status: TaskStatus) => {
    setCurrentDetailStatus(status);
    updateTaskStatus(taskId, status);
  };

  const handleTaskDueDateChange = (taskId: string, date: Date | undefined) => {
    const dateString = date ? formatDateForInput(date.toISOString()) : "";
    setCurrentDetailDueDate(dateString);
    updateTaskDueDate(taskId, date);
  };

  // Update local states when selected task changes
  useEffect(() => {
    if (selectedTask) {
      // When a task is selected, immediately update the detail view states
      setCurrentDetailStatus(selectedTask.status);
      setCurrentDetailDueDate(formatDateForInput(selectedTask.dueDate) || "");
      setCurrentEditorData({
        time: selectedTask.notes?.content?.time || Date.now(),
        blocks: selectedTask.notes?.content?.blocks || [],
        version: selectedTask.notes?.content?.version || "",
      });
    }
  }, [
    selectedTask,
    selectedTask?.status,
    selectedTask?.dueDate,
    selectedTask?.notes,
  ]);

  // When the task list changes (e.g. after an update), sync the selected task
  useEffect(() => {
    if (selectedTask) {
      const updatedTask = tasks.find((task) => task.id === selectedTask.id);
      if (updatedTask) {
        setSelectedTask(updatedTask);
      }
    }
  }, [tasks, selectedTask]);

  return {
    // State
    tasks,
    isSaving,
    lastSaved,
    dialogOpen,
    newTask,
    editingTask,
    searchTerm,
    filter,
    dueDate,
    detailsOpen,
    selectedTask,
    currentPage,
    paginatedTasks,
    totalPages,
    sortBy,
    sortType,
    // Actions
    setDialogOpen,
    setNewTask,
    setSearchTerm,
    setFilter,
    setDueDate,
    setDetailsOpen,
    setSelectedTask,
    setCurrentPage,
    setSortBy,
    setSortType,
    // Functions
    getLastSavedText,
    addOrUpdateTask,
    startEditingTask,
    updateTaskStatus,
    deleteTaskHandler,
    updateTaskDueDate,
    addNote,
    resetForm,
    triggerManualSave,
    // TaskDetails states
    currentDetailStatus,
    currentDetailDueDate,
    currentEditorData,
    // TaskDetails functions
    formatDate,
    formatDateForInput,
    handleTaskStatusChange,
    handleTaskDueDateChange,
  };
}
