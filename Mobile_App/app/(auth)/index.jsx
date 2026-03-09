import { router } from "expo-router";
import { useEffect } from "react";
import SplashScreen from "./splash";

export default function Index() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/login");
    }, 3000);
  }, []);

  return <SplashScreen />;
}
