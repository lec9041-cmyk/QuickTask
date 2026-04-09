import { useState } from "react";
import { TodoItem } from "../lib/store";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Calendar, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";

interface TodoRowProps {
  todo: TodoItem;
  onToggle: () => void;
  onUpdateDue: (due: string) => void;
  onDelete: () => void;
}

export function TodoRow({ todo, onToggle, onUpdateDue, onDelete }: TodoRowProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onUpdateDue(format(date, "yyyy-MM-dd"));
      setCalendarOpen(false);
    }
  };

  const handleClearDue = () => {
    onUpdateDue("");
  };

  const dueDate = todo.due ? new Date(todo.due) : undefined;
  const isOverdue = dueDate && dueDate < new Date() && !todo.done;

  return (
    <div
      className={`group bg-white/80 backdrop-blur-md rounded-xl shadow-sm border transition-all hover:shadow-md ${
        todo.done
          ? "border-slate-200/60 bg-slate-50/50"
          : "border-slate-200/60 hover:border-slate-300/60"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.done}
            onCheckedChange={onToggle}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium transition-all ${
                todo.done
                  ? "text-slate-400 line-through"
                  : "text-slate-800"
              }`}
            >
              {todo.text}
            </p>

            {/* Due Date */}
            <div className="flex items-center gap-2 mt-2">
              {todo.due ? (
                <div
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg ${
                    isOverdue
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : todo.done
                      ? "bg-slate-50 text-slate-400 border border-slate-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>
                    {dueDate && format(dueDate, "M월 d일")}
                  </span>
                  <button
                    onClick={handleClearDue}
                    className="ml-1 hover:bg-white/50 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Calendar className="w-3 h-3 mr-1.5" />
                      마감일 설정
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dueDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}