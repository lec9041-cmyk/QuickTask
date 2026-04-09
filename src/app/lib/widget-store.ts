export interface WidgetTodo {
  id: string;
  text: string;
  done: boolean;
}

export interface WidgetTab {
  id: string;
  label: string;
  color: string;
  todos: WidgetTodo[];
}

export const WIDGET_COLORS = [
  "#FFB3BA", // 파스텔 핑크
  "#FFDFBA", // 파스텔 오렌지
  "#FFFFBA", // 파스텔 옐로우
  "#BAFFC9", // 파스텔 그린
  "#BAE1FF", // 파스텔 블루
  "#E0BBE4", // 파스텔 퍼플
];

class WidgetStore {
  private readonly STORAGE_KEY = "quicktask_widget_tabs";

  load(): WidgetTab[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        // 기본 탭 생성
        return [
          {
            id: crypto.randomUUID(),
            label: "마감",
            color: WIDGET_COLORS[0],
            todos: [],
          },
          {
            id: crypto.randomUUID(),
            label: "학교",
            color: WIDGET_COLORS[4],
            todos: [],
          },
          {
            id: crypto.randomUUID(),
            label: "PDF",
            color: WIDGET_COLORS[5],
            todos: [],
          },
        ];
      }

      const parsed = JSON.parse(data);
      return parsed.tabs || [];
    } catch {
      return [];
    }
  }

  save(tabs: WidgetTab[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ tabs }));
  }
}

export const widgetStore = new WidgetStore();
