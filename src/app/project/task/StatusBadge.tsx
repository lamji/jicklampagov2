/** @format */

import { Circle, Clock, Check } from "lucide-react";

export type TaskStatus = "Not Started" | "In Progress" | "Completed";

const StatusIndicator = ({ status }: { status: TaskStatus }) => {
  switch (status) {
    case "Not Started":
      return <Circle className="w-4 h-4 text-gray-400" />;
    case "In Progress":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "Completed":
      return <Check className="w-4 h-4 text-green-500" />;
  }
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const baseClasses =
    "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200";
  const statusClasses = {
    "Not Started": "bg-gray-100 text-gray-800 hover:bg-gray-200",
    "In Progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Completed: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  return (
    <div
      className={`${baseClasses} ${statusClasses[status]} flex items-center gap-2`}
    >
      <StatusIndicator status={status} />
      {status}
    </div>
  );
}
