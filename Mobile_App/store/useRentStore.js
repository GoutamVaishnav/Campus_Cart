import { create } from "zustand";
import userStore from "./useUserStore";
import { GetRentProductById } from "../services/rent-service/get-products";
import { GetRentProducts } from "../services/rent-service/get-products";

const useRentStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  // ── Actions ──────────────────────────────────────────────────

  fetchProducts: async (force = false) => {
    const { lastFetched, isLoading } = get();
    const FIVE_MINUTES = 5 * 60 * 1000;
    const isStale = !lastFetched || Date.now() - lastFetched > FIVE_MINUTES;
    const college = userStore.getState().user?.college;

    if (!force && !isStale) return;
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const response = await GetRentProducts({ college });
      console.log(response);

      set({
        products: response.products,
        lastFetched: Date.now(),
        isLoading: false,
      });
    } catch (e) {
      console.log(e);

      set({
        error: e.response?.data?.message ?? "Failed to fetch listings.",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id) => {
    id = Number(id);
    const cached = get().products.find((p) => p.product_id === id);
    if (cached) {
      console.log("cache");

      set({ selectedProduct: cached });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await GetRentProductById({ productId: id });
      set({ selectedProduct: response, isLoading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message ?? "Failed to fetch product.",
        isLoading: false,
      });
    }
  },

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  updateProduct: (updatedProduct) =>
    set((state) => ({
      products: state.products.map(
        (p) =>
          p.product_id === updatedProduct.product_id ? updatedProduct : p, // ✅
      ),
      selectedProduct:
        state.selectedProduct?.product_id === updatedProduct.product_id
          ? updatedProduct
          : state.selectedProduct,
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.product_id !== Number(id)), // ✅
      selectedProduct:
        state.selectedProduct?.product_id === Number(id)
          ? null
          : state.selectedProduct, // ✅
    })),

  clearStore: () =>
    set({
      products: [],
      selectedProduct: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    }),
}));

export default useRentStore;
