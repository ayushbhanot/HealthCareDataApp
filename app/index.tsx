import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        router.replace("/(tabs)/dashboard"); // Redirect to Dashboard if logged in
      } else {
        router.replace("/LoginScreen"); // Redirect to Login if NOT logged in
      }
    };

    checkAuth();
  }, []);

  return null; // This prevents rendering anything on this screen
}
