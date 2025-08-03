import { create } from "zustand";
import { useEffect } from "react";

let debounceTimeout;

export const useFeedFilterStore = create((set, get) => ({
  filter: localStorage.getItem("feed-filter") || "all",
  setFilter: (filter) => {
    set({ filter });

    // Debounce the localStorage write
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      localStorage.setItem("feed-filter", filter);
    }, 300);
  },
}));
