import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Single source of truth for logged-in user and auth token
const useUserStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  isHydrated: false, // true after AsyncStorage is read on app start

  // ── Load from AsyncStorage on app start ─────────────────────
  hydrate: async () => {
    try {
      const [[, userData], [, accessToken], [, refreshToken]] =
        await AsyncStorage.multiGet(["user", "accessToken", "refreshToken"]);

      if (userData && accessToken) {
        set({
          user: JSON.parse(userData),
          accessToken,
          refreshToken,
          isLoggedIn: true,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  // ── Called after successful login ───────────────────────────
  login: async ({ user, accessToken, refreshToken }) => {
    // Persist to AsyncStorage
    // await AsyncStorage.multiSet([
    //   ["user", JSON.stringify(user)],
    //   ["accessToken", accessToken],
    //   ["refreshToken", refreshToken],
    // ]);
    set({ user, accessToken, refreshToken, isLoggedIn: true });
  },

  // ── Called on logout ────────────────────────────────────────
  logout: async () => {
    await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    });
  },

  // ── Update user details (e.g. after profile edit) ───────────
  updateUser: async (updatedUser) => {
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // ── Getters ──────────────────────────────────────────────────
  getToken: () => get().accessToken,
  getUserId: () => get().user?.id ?? null,
}));

export default useUserStore;
