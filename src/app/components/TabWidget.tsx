import { useState, useEffect, useRef } from "react";
import { WidgetTab, widgetStore } from "../lib/widget-store";
import { Plus, X } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

export function TabWidget() {
  const [tabs, setTabs] = useState<WidgetTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = widgetStore.load();
    setTabs(loaded);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveTabId(null);
      }
    };

    if (activeTabId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [activeTabId]);

  const handleFileClick = (tabId: string) => {
    setActiveTabId(activeTabId === tabId ? null : tabId);
    if (activeTabId !== tabId) {
      setNewTodoText("");
    }
  };

  const handleAddTodo = (tabId: string) => {
    if (!newTodoText.trim()) return;

    const updated = tabs.map((tab) => {
      if (tab.id === tabId) {
        return {
          ...tab,
          todos: [
            ...tab.todos,
            {
              id: crypto.randomUUID(),
              text: newTodoText.trim(),
              done: false,
            },
          ],
        };
      }
      return tab;
    });

    setTabs(updated);
    widgetStore.save(updated);
    setNewTodoText("");
  };

  const handleToggleTodo = (tabId: string, todoId: string) => {
    const updated = tabs.map((tab) => {
      if (tab.id === tabId) {
        return {
          ...tab,
          todos: tab.todos.map((todo) =>
            todo.id === todoId ? { ...todo, done: !todo.done } : todo
          ),
        };
      }
      return tab;
    });

    setTabs(updated);
    widgetStore.save(updated);
  };

  const handleDeleteTodo = (tabId: string, todoId: string) => {
    const updated = tabs.map((tab) => {
      if (tab.id === tabId) {
        return {
          ...tab,
          todos: tab.todos.filter((todo) => todo.id !== todoId),
        };
      }
      return tab;
    });

    setTabs(updated);
    widgetStore.save(updated);
  };

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div ref={containerRef} className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
      {/* 오른쪽 끝에 겹쳐진 인덱스 탭들 */}
      <div className="relative">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          const undoneCount = tab.todos.filter((t) => !t.done).length;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleFileClick(tab.id)}
              className="absolute right-0 h-12 px-3 rounded-l-lg transition-all duration-200 hover:px-4"
              style={{
                top: `${index * 48}px`,
                backgroundColor: tab.color,
                filter: isActive ? "brightness(1.1)" : "brightness(0.95)",
                boxShadow: isActive 
                  ? `0 4px 12px ${tab.color}70` 
                  : `0 2px 6px ${tab.color}40`,
                zIndex: isActive ? 100 : 50 - index,
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-800 whitespace-nowrap">
                  {tab.label}
                </span>
                {undoneCount > 0 && (
                  <div
                    className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
                    style={{
                      boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {undoneCount > 99 ? "99+" : undoneCount}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 선택된 파일의 내용 - 오른쪽 끝에 딱 붙어서 열림 */}
      {activeTab && (
        <div
          className="fixed right-0 top-1/2 -translate-y-1/2 w-[220px] h-80 rounded-l-xl border-2 overflow-hidden"
          style={{
            backgroundColor: activeTab.color,
            borderColor: `${activeTab.color}dd`,
            boxShadow: `0 8px 32px ${activeTab.color}90`,
            zIndex: 90,
          }}
        >
          {/* 흰 속지 */}
          <div className="h-full bg-white/98 m-2 p-4 flex flex-col rounded-l-lg">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-200">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-800">{activeTab.label}</h3>
                <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {activeTab.todos.filter((t) => !t.done).length}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTabId(null);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* 할 일 리스트 */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
              {activeTab.todos.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  비어있음
                </div>
              ) : (
                activeTab.todos
                  .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className={`
                        group flex items-start gap-2 p-2 rounded-lg
                        transition-colors
                        ${todo.done ? "bg-gray-50" : "hover:bg-gray-100"}
                      `}
                    >
                      <Checkbox
                        checked={todo.done}
                        onCheckedChange={() => handleToggleTodo(activeTab.id, todo.id)}
                        className="mt-0.5 h-4 w-4 flex-shrink-0"
                      />
                      <p
                        className={`
                          flex-1 text-xs leading-relaxed
                          ${todo.done ? "text-gray-400 line-through" : "text-gray-700"}
                        `}
                      >
                        {todo.text}
                      </p>
                      <button
                        onClick={() => handleDeleteTodo(activeTab.id, todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all flex-shrink-0"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  ))
              )}
            </div>

            {/* 추가 입력 */}
            <div className="flex gap-2 pt-2 border-t-2 border-gray-200">
              <input
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTodo(activeTab.id);
                  }
                }}
                placeholder="추가..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-gray-400 transition-colors text-gray-700 placeholder:text-gray-400"
              />
              <button
                onClick={() => handleAddTodo(activeTab.id)}
                className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
