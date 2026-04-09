import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router";
import { Category, TodoItem, store } from "../lib/store";
import { TodoRow } from "./TodoRow";
import { AddTodoBox } from "./AddTodoBox";
import { CheckCircle2, Circle } from "lucide-react";

interface OutletContext {
  categories: Category[];
  refreshCategories: () => void;
}

export function CategoryView() {
  const { categoryId } = useParams();
  const { categories, refreshCategories } = useOutletContext<OutletContext>();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const found = categories.find((cat) => cat.id === categoryId);
    setCategory(found || null);
  }, [categoryId, categories]);

  if (!category) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">카테고리를 선택하세요</p>
      </div>
    );
  }

  const handleAddTodo = (text: string, due: string) => {
    const newTodo: TodoItem = { text, done: false, due };
    const updated = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, todos: [...cat.todos, newTodo] } : cat
    );
    store.save(updated);
    refreshCategories();
  };

  const handleToggleTodo = (index: number) => {
    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        const newTodos = [...cat.todos];
        newTodos[index] = { ...newTodos[index], done: !newTodos[index].done };
        return { ...cat, todos: newTodos };
      }
      return cat;
    });
    store.save(updated);
    refreshCategories();
  };

  const handleUpdateDue = (index: number, due: string) => {
    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        const newTodos = [...cat.todos];
        newTodos[index] = { ...newTodos[index], due };
        return { ...cat, todos: newTodos };
      }
      return cat;
    });
    store.save(updated);
    refreshCategories();
  };

  const handleDeleteTodo = (index: number) => {
    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        const newTodos = cat.todos.filter((_, i) => i !== index);
        return { ...cat, todos: newTodos };
      }
      return cat;
    });
    store.save(updated);
    refreshCategories();
  };

  const undoneCount = category.todos.filter((todo) => !todo.done).length;
  const totalCount = category.todos.length;
  const completionRate = totalCount > 0 ? Math.round((totalCount - undoneCount) / totalCount * 100) : 0;

  // Sort todos: undone first, then done
  const sortedTodos = [...category.todos].sort((a, b) => {
    if (a.done === b.done) return 0;
    return a.done ? 1 : -1;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h1 className="text-2xl font-bold text-slate-900">{category.name}</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              {undoneCount > 0 ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <Circle className="w-4 h-4" />
                    <span>남은 일 {undoneCount}개</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>완료 {totalCount - undoneCount}개</span>
                  </div>
                </>
              ) : totalCount > 0 ? (
                <div className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-semibold">모두 완료! 🎉</span>
                </div>
              ) : (
                <span className="text-slate-400">할 일을 추가해보세요</span>
              )}
            </div>
          </div>
          {totalCount > 0 && (
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">{completionRate}%</div>
              <div className="text-xs text-slate-500">완료율</div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        )}
      </div>

      {/* Add Todo Box */}
      <AddTodoBox onAdd={handleAddTodo} />

      {/* Todo List */}
      <div className="space-y-3">
        {sortedTodos.map((todo, originalIndex) => {
          // Find the actual index in the original array
          const actualIndex = category.todos.findIndex(
            (t) => t === todo
          );

          return (
            <TodoRow
              key={actualIndex}
              todo={todo}
              onToggle={() => handleToggleTodo(actualIndex)}
              onUpdateDue={(due) => handleUpdateDue(actualIndex, due)}
              onDelete={() => handleDeleteTodo(actualIndex)}
            />
          );
        })}
      </div>

      {category.todos.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-slate-400 text-lg">아직 할 일이 없습니다</p>
          <p className="text-slate-300 text-sm mt-2">위에서 새로운 할 일을 추가해보세요</p>
        </div>
      )}
    </div>
  );
}
