import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IconFavoritesState {
  favorites: string[];
  addFavorite: (name: string) => void;
  removeFavorite: (name: string) => void;
  toggleFavorite: (name: string) => void;
  clearFavorites: () => void;
}

export const useIconFavorites = create<IconFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (name) => set((s) => {
        if (s.favorites.includes(name)) return s;
        return { favorites: [name, ...s.favorites] };
      }),
      removeFavorite: (name) => set((s) => ({
        favorites: s.favorites.filter((f) => f !== name),
      })),
      toggleFavorite: (name) => {
        const { favorites } = get();
        if (favorites.includes(name)) {
          set({ favorites: favorites.filter((f) => f !== name) });
        } else {
          set({ favorites: [name, ...favorites] });
        }
      },
      clearFavorites: () => set({ favorites: [] }),
    }),
    { name: 'easy-cover-icon-favorites' },
  ),
);
