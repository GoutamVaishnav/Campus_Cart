// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import SplashScreen from "./splash";

// export default function Index() {
//   const router = useRouter();

//   useEffect(() => {
//     setTimeout(() => {
//       router.replace("/login");
//     }, 3000);
//   }, []);

//   return <SplashScreen />;
// }

import { useRouter } from "expo-router";
import { useEffect } from "react";
import SplashScreen from "./splash";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login"); // ✅ Use full path with group
    }, 3000);

    return () => clearTimeout(timer); // ✅ Cleanup on unmount
  }, []);

  return <SplashScreen />;
}
