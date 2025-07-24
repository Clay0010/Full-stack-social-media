import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("social-theme") || "coffee",
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("social-theme", theme);
  },
}));
