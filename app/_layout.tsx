import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
const jwt_decode = require("jwt-decode") as <T>(token: string) => T;



const isTokenValid = (token: string) => {
  try {
    const { exp } = jwt_decode<{ exp: number }>(token);
    if (!exp) return false;
    return exp * 1000 > Date.now(); // Convert exp to ms
  } catch (e) {
    return false;
  }
};




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
      const valid = token !== null && isTokenValid(token);
      setIsAuthenticated(valid);
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
  <Stack.Screen 
    name="LoginScreen" 
    options={{ headerShown: false }} 
  />
  <Stack.Screen 
    name="(tabs)" 
    options={{
      headerShown: true,
      headerBackVisible: false,
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
  <Stack.Screen
    name="patients/[id]"
    options={{ headerShown: false }}
  />
  <Stack.Screen
    name="patients/edit"
    options={{ headerShown: false }} // 👈 this is the one you needed
  />
    <Stack.Screen
    name="questionnaire"
    options={{ headerShown: false }} // 👈 this is the one you needed
  />
  <Stack.Screen 
    name="patients/addSymptom" 
    options={{ headerShown: false }} 
  />
   <Stack.Screen 
    name="admin/delete" 
    options={{ headerShown: false }} 
  />
   <Stack.Screen 
    name="admin/registerUser" 
    options={{ headerShown: false }} 
  />
</Stack>

      <StatusBar />
      
    </>
  );
}
