import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";

interface AddTodoBoxProps {
  onAdd: (text: string, due: string) => void;
}

export function AddTodoBox({ onAdd }: AddTodoBoxProps) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleAdd = () => {
    if (!text.trim()) return;

    const due = dueDate ? format(dueDate, "yyyy-MM-dd") : "";
    onAdd(text.trim(), due);
    setText("");
    setDueDate(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/60 p-5">
      <div className="flex gap-3 mb-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="새로운 할 일을 입력하세요..."
          className="flex-1 border-slate-300 focus-visible:ring-blue-500"
        />
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          추가
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={dueDate ? "bg-blue-50 border-blue-200 text-blue-700" : ""}
            >
              <Calendar className="w-4 h-4 mr-1.5" />
              {dueDate ? format(dueDate, "M월 d일") : "마감일 설정"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dueDate}
              onSelect={(date) => {
                setDueDate(date);
                setCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {dueDate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDueDate(undefined)}
            className="text-slate-500 hover:text-slate-700"
          >
            지우기
          </Button>
        )}
      </div>
    </div>
  );
}