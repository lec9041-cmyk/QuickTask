import { useState } from "react";
import { useNavigate } from "react-router";
import { Category, DEFAULT_COLORS, store } from "../lib/store";
import { Plus, MoreVertical, Edit2, Trash2, Palette, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface CategoryRailProps {
  categories: Category[];
  activeCategoryId?: string;
  onRefresh: () => void;
}

export function CategoryRail({ categories, activeCategoryId, onRefresh }: CategoryRailProps) {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [renameCategoryId, setRenameCategoryId] = useState("");
  const [renameCategoryName, setRenameCategoryName] = useState("");
  const [colorCategoryId, setColorCategoryId] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState("");

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      color: DEFAULT_COLORS[categories.length % DEFAULT_COLORS.length],
      todos: [],
    };

    const updated = [...categories, newCategory];
    store.save(updated);
    setNewCategoryName("");
    setIsAddDialogOpen(false);
    onRefresh();
    navigate(`/${newCategory.id}`);
  };

  const handleRename = () => {
    if (!renameCategoryName.trim()) return;

    const updated = categories.map((cat) =>
      cat.id === renameCategoryId ? { ...cat, name: renameCategoryName.trim() } : cat
    );
    store.save(updated);
    setIsRenameDialogOpen(false);
    onRefresh();
  };

  const handleChangeColor = () => {
    const updated = categories.map((cat) =>
      cat.id === colorCategoryId ? { ...cat, color: selectedColor } : cat
    );
    store.save(updated);
    setIsColorDialogOpen(false);
    onRefresh();
  };

  const handleDelete = () => {
    const updated = categories.filter((cat) => cat.id !== deleteCategoryId);
    store.save(updated);
    setIsDeleteDialogOpen(false);
    onRefresh();

    if (activeCategoryId === deleteCategoryId && updated.length > 0) {
      navigate(`/${updated[0].id}`);
    }
  };

  const handleMove = (categoryId: string, direction: "up" | "down") => {
    const currentIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const updated = [...categories];
    [updated[currentIndex], updated[newIndex]] = [updated[newIndex], updated[currentIndex]];
    store.save(updated);
    onRefresh();
  };

  const openRenameDialog = (category: Category) => {
    setRenameCategoryId(category.id);
    setRenameCategoryName(category.name);
    setIsRenameDialogOpen(true);
  };

  const openColorDialog = (category: Category) => {
    setColorCategoryId(category.id);
    setSelectedColor(category.color);
    setIsColorDialogOpen(true);
  };

  const openDeleteDialog = (categoryId: string) => {
    setDeleteCategoryId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const getUndoneCount = (category: Category) => {
    return category.todos.filter((todo) => !todo.done).length;
  };

  return (
    <div className="h-full bg-white/80 backdrop-blur-md border-r border-slate-200/60 flex flex-col">
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">카테고리</h2>
          <Button
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {categories.map((category) => {
            const undoneCount = getUndoneCount(category);
            const isActive = category.id === activeCategoryId;

            return (
              <div
                key={category.id}
                className={`group relative flex items-center gap-2 p-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
                    : "hover:bg-slate-50"
                }`}
              >
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <button
                  onClick={() => navigate(`/${category.id}`)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        isActive ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {category.name}
                    </span>
                    {undoneCount > 0 && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {undoneCount}
                      </span>
                    )}
                  </div>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-lg hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openRenameDialog(category)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      이름 수정
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openColorDialog(category)}>
                      <Palette className="w-4 h-4 mr-2" />
                      색상 변경
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleMove(category.id, "up")}>
                      <ArrowUp className="w-4 h-4 mr-2" />
                      위로 이동
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMove(category.id, "down")}>
                      <ArrowDown className="w-4 h-4 mr-2" />
                      아래로 이동
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(category.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 카테고리 추가</DialogTitle>
            <DialogDescription>카테고리 이름을 입력하세요.</DialogDescription>
          </DialogHeader>
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="카테고리 이름"
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddCategory}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Category Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 이름 수정</DialogTitle>
            <DialogDescription>새로운 이름을 입력하세요.</DialogDescription>
          </DialogHeader>
          <Input
            value={renameCategoryName}
            onChange={(e) => setRenameCategoryName(e.target.value)}
            placeholder="카테고리 이름"
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleRename}>수정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Color Dialog */}
      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>색상 변경</DialogTitle>
            <DialogDescription>카테고리의 색상을 선택하세요.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-full aspect-square rounded-xl transition-all ${
                  selectedColor === color
                    ? "ring-4 ring-offset-2 ring-slate-400 scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsColorDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleChangeColor}>변경</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 카테고리와 모든 할 일이 영구적으로 삭제됩니다. 계속하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
