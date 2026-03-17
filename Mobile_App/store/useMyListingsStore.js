import { create } from "zustand";
import lostFoundApi from "@/services/lostFoundApi";
import { mylostfoundProducts } from "../services/lost-found-service/get-products";
import { myrentProducts } from "../services/rent-service/get-products";
import { mysellProducts } from "../services/buy-sell-services/get-products";

// Stores the current user's own listings across all 3 services
const useMyListingsStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────
  sellListings: [],
  rentListings: [],
  lostFoundListings: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  // ── Fetch all 3 in parallel ──────────────────────────────────
  fetchMyListings: async (userId, force = false) => {
    const { lastFetched, isLoading } = get();
    const FIVE_MINUTES = 5 * 60 * 1000;
    const isStale = !lastFetched || Date.now() - lastFetched > FIVE_MINUTES;

    if (!force && !isStale) return;
    if (isLoading) return;
    if (!userId) return;

    set({ isLoading: true, error: null });
    try {
      // All 3 microservices fetched simultaneously
      const [sellRes, rentRes, lostFoundRes] = await Promise.all([
        mysellProducts({ userid: userId }),
        myrentProducts({ userid: userId }),
        mylostfoundProducts({ userid: userId }),
      ]);
      console.log("HELO");
      // console.log(sellRes);
      // console.log(rentRes);
      // console.log(lostFoundRes);

      set({
        sellListings: sellRes.products,
        rentListings: rentRes.products,
        lostFoundListings: lostFoundRes.products,
        lastFetched: Date.now(),
        isLoading: false,
      });
      console.log(get().sellListings);
    } catch (e) {
      console.log(e);

      set({
        error: e.response?.data?.message ?? "Failed to fetch your listings.",
        isLoading: false,
      });
    }
  },

  // ── Per-type add / update / remove ───────────────────────────

  // SELL
  addSellListing: (product) =>
    set((state) => ({ sellListings: [product, ...state.sellListings] })),

  updateSellListing: (updated) =>
    set((state) => ({
      sellListings: state.sellListings.map(
        (p) => (p.product_id === updated.product_id ? updated : p), // ✅
      ),
    })),

  removeSellListing: (id) =>
    set((state) => ({
      sellListings: state.sellListings.filter(
        (p) => p.product_id !== Number(id),
      ), // ✅
    })),

  // RENT
  addRentListing: (product) =>
    set((state) => ({ rentListings: [product, ...state.rentListings] })),

  updateRentListing: (updated) =>
    set((state) => ({
      rentListings: state.rentListings.map(
        (p) => (p.product_id === updated.product_id ? updated : p), // ✅
      ),
    })),

  removeRentListing: (id) =>
    set((state) => ({
      rentListings: state.rentListings.filter(
        (p) => p.product_id !== Number(id),
      ), // ✅
    })),

  // LOST & FOUND
  addLostFoundListing: (item) =>
    set((state) => ({ lostFoundListings: [item, ...state.lostFoundListings] })),

  updateLostFoundListing: (updated) =>
    set((state) => ({
      lostFoundListings: state.lostFoundListings.map(
        (i) => (i.product_id === updated.product_id ? updated : i), // ✅
      ),
    })),

  removeLostFoundListing: (id) =>
    set((state) => ({
      lostFoundListings: state.lostFoundListings.filter(
        (i) => i.product_id !== Number(id),
      ), // ✅
    })),

  // ── Computed helpers ─────────────────────────────────────────
  getTotalCount: () => {
    console.log("calculating");

    const { sellListings, rentListings, lostFoundListings } = get();
    return {
      sell: sellListings.length,
      rent: rentListings.length,
      lostFound: lostFoundListings.length,
      total:
        sellListings.length + rentListings.length + lostFoundListings.length,
    };
  },

  clearStore: () =>
    set({
      sellListings: [],
      rentListings: [],
      lostFoundListings: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    }),
}));

export default useMyListingsStore;
