/** @format */

import { Circle, Clock, Check } from "lucide-react";

export type TaskStatus = "Not Started" | "In Progress" | "Completed";

export const StatusIndicator = ({ status }: { status: TaskStatus }) => {
  switch (status) {
    case "Not Started":
      return <Circle className="w-4 h-4 text-gray-400" />;
    case "In Progress":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "Completed":
      return <Check className="w-4 h-4 text-green-500" />;
  }
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "Not Started":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusStyles()} ${className}`}
    >
      {status}
    </span>
  );
}
