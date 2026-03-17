import { create } from "zustand";
import lostFoundApi from "@/services/lostFoundApi";
import { GetLostFoundProducts } from "../services/lost-found-service/get-products";
import useUserStore from "./useUserStore";
import { GetLostFoundProductById } from "../services/lost-found-service/get-products";

const useLostFoundStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────
  items: [], // lost & found has no price so called "items"
  selectedItem: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  // ── Actions ──────────────────────────────────────────────────

  fetchItems: async (force = false) => {
    const { lastFetched, isLoading } = get();
    const FIVE_MINUTES = 5 * 60 * 1000;
    const isStale = !lastFetched || Date.now() - lastFetched > FIVE_MINUTES;
    const college = useUserStore.getState().user?.college;

    if (!force && !isStale) return;
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const response = await GetLostFoundProducts({ college });
      set({
        items: response,
        lastFetched: Date.now(),
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e.response?.data?.message ?? "Failed to fetch items.",
        isLoading: false,
      });
    }
  },

  fetchItemById: async (id) => {
    id = Number(id);
    const cached = get().items.find((i) => i.id === id);
    if (cached) {
      set({ selectedItem: cached });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await GetLostFoundProductById({ productId: id });
      set({ selectedItem: response, isLoading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message ?? "Failed to fetch item.",
        isLoading: false,
      });
    }
  },

  setSelectedItem: (item) => set({ selectedItem: item }),

  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),

  updateItem: (updatedItem) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === updatedItem.id ? updatedItem : i,
      ),
      selectedItem:
        state.selectedItem?.id === updatedItem.id
          ? updatedItem
          : state.selectedItem,
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
    })),

  clearStore: () =>
    set({
      items: [],
      selectedItem: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    }),
}));

export default useLostFoundStore;
