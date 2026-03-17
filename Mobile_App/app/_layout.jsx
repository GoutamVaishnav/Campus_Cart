import { useEffect, useRef } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/use-color-scheme";
import useUserStore from "@/store/useUserStore";

SplashScreen.preventAutoHideAsync();

const SPLASH_DURATION = 3000;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hydrate = useUserStore((s) => s.hydrate);

  const splashDone = useRef(false);
  const authDone = useRef(false);

  useEffect(() => {
    // Hide native splash immediately — custom splash (index.jsx) takes over
    SplashScreen.hideAsync();

    const tryRedirect = () => {
      if (!splashDone.current || !authDone.current) return;
      // Read fresh store state AFTER hydration completes
      const isLoggedIn = useUserStore.getState().isLoggedIn;
      router.replace(isLoggedIn ? "/(tabs)" : "/(auth)/login");
    };

    // Condition 1 — hydrate store from AsyncStorage
    hydrate().then(() => {
      authDone.current = true;
      tryRedirect();
    });

    // Condition 2 — wait for full splash animation
    const t = setTimeout(() => {
      splashDone.current = true;
      tryRedirect();
    }, SPLASH_DURATION);

    return () => clearTimeout(t);
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
