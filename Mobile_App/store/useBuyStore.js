import { create } from "zustand";
import { getSellProducts } from "../services/buy-sell-services/get-products";
import { getProductById } from "../services/buy-sell-services/get-products";
import useUserStore from "./useUserStore";

const useBuyStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────
  products: [], // full list from API
  selectedProduct: null, // currently viewed product
  isLoading: false,
  error: null,
  lastFetched: null, // timestamp — used to avoid refetching

  // ── Actions ──────────────────────────────────────────────────

  // Fetch all buy listings — skips if fetched within last 5 minutes
  fetchProducts: async (force = false) => {
    const { lastFetched, isLoading } = get();
    const FIVE_MINUTES = 5 * 60 * 1000;
    const isStale = !lastFetched || Date.now() - lastFetched > FIVE_MINUTES;
    const college = useUserStore.getState().user?.college;

    if (!force && !isStale) return; // already fresh, skip API call
    if (isLoading) return; // already fetching

    set({ isLoading: true, error: null });
    try {
      const response = await getSellProducts({ college }); // or pass specific college
      console.log("hello");

      set({
        products: response.products,
        lastFetched: Date.now(),
        isLoading: false,
      });
      console.log(get().products);
    } catch (e) {
      console.log("error");

      set({
        error: e.response?.data?.message ?? "Failed to fetch listings.",
        isLoading: false,
      });
    }
  },

  // Fetch single product by ID — checks cache first
  fetchProductById: async (id) => {
    // console.log("id:", typeof id);
    id = Number(id);
    // console.log("id after conversion:", typeof id);
    // Check if product is already in list cache
    const cached = get().products.find((p) => p.product_id === id);
    if (cached) {
      console.log("cache");

      set({ selectedProduct: cached });
      return;
    }
    // Not in list cache — fetch individually
    set({ isLoading: true, error: null });
    try {
      const response = await getProductById({ id });
      set({ selectedProduct: response, isLoading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message ?? "Failed to fetch product.",
        isLoading: false,
      });
    }
  },

  // Set selected product directly (when navigating from list — instant)
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // Add a new product to local list after posting (no refetch needed)
  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  // Update a product in local list after editing
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

  // Clear everything (on logout)
  clearStore: () =>
    set({
      products: [],
      selectedProduct: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    }),
}));

export default useBuyStore;
