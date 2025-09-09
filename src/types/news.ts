

// то, что уходит в клиентские компоненты (UI)
export type NewsDTO = {
  id: number;
  title: string;
  slug: string;
  category: string;              // имя категории
  isPinned: boolean;
  publishDate: string | null;
  pinnedAt: string | null;
  image: string | null;
};
