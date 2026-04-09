export interface TodoItem {
  text: string;
  done: boolean;
  due: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  todos: TodoItem[];
}

export const DEFAULT_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
];

class Store {
  private readonly STORAGE_KEY = "quicktask_data";

  load(): Category[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.categories || [];
    } catch {
      return [];
    }
  }

  save(categories: Category[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({ categories })
    );
  }
}

export const store = new Store();
