import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      setIsAuthenticated(!!token);
      setCheckingAuth(false);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (loaded && !checkingAuth) {
      // Delay hiding the splash screen for a couple seconds
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        // If not authenticated, ensure we’re on the LoginScreen
        if (!isAuthenticated) {
          router.replace("/LoginScreen");
        }
      }, 1500);
    }
  }, [loaded, isAuthenticated, checkingAuth, router]);

  if (!loaded || checkingAuth) {
    return null;
  }

  return (
    <>
      <Stack>
        {/* The login screen with no header */}
        <Stack.Screen 
          name="LoginScreen" 
          options={{ headerShown: false }} 
        />
        {/* The authenticated tabs flow with a custom header */}
        <Stack.Screen 
          name="(tabs)" 
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#241b35' },
            headerTitle: () => (
              <Image
                source={require('../assets/images/icon.png')}
                style={{ width: 120, height: 40, resizeMode: 'contain' }}
              />
            ),
            headerTitleAlign: 'center',
          }}
        />
      </Stack>
      <StatusBar />
    </>
  );
}
