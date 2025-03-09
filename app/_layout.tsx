// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack, useRouter } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect, useState } from 'react';
// import 'react-native-reanimated';
// import * as SecureStore from 'expo-secure-store';

// import { useColorScheme } from '@/hooks/useColorScheme';

// // Prevent splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const router = useRouter();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     const checkLogin = async () => {
//       const token = await SecureStore.getItemAsync("userToken");
//       if (token) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//       }
//     };

//     checkLogin();
//   }, []);

//   useEffect(() => {
//     if (loaded && isAuthenticated !== null) {
//       SplashScreen.hideAsync();
//       if (!isAuthenticated) {
//         router.replace("/LoginScreen"); // Redirect to Login if NOT logged in
//       }
//     }
//   }, [loaded, isAuthenticated]);

//   if (!loaded || isAuthenticated === null) {
//     return null; // Prevents app from flashing the wrong screen
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         {!isAuthenticated ? (
//           <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
//         ) : (
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         )}
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import {
  GestureHandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true); // Prevent re-renders during auth check
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null); // Track swipe direction

  useEffect(() => {
    const checkLogin = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      setIsAuthenticated(!!token);
      setCheckingAuth(false); // Mark authentication check as complete
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (loaded && !checkingAuth) {
      SplashScreen.hideAsync();
      if (isAuthenticated === false) {
        router.replace("/LoginScreen"); // Redirect once auth check completes
      }
    }
  }, [loaded, isAuthenticated, checkingAuth]);

  // Remove generic from the event type and cast nativeEvent to access translationX
  const onSwipe = (e: GestureHandlerStateChangeEvent) => {
    // Cast nativeEvent to unknown then to PanGestureHandlerEventPayload
    const { translationX } = e.nativeEvent as unknown as PanGestureHandlerEventPayload;
    const threshold = 50; // Adjust sensitivity as needed
  
    if (translationX < -threshold) {
      // Handle left swipe
      console.log('Swiped left');
    } else if (translationX > threshold) {
      // Handle right swipe
      console.log('Swiped right');
    }
  };

  if (!loaded || checkingAuth) {
    return null; // Wait for authentication check to complete
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onHandlerStateChange={onSwipe}>
        <View style={{ flex: 1 }}>
          <Stack>
            {!isAuthenticated ? (
              <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            )}
          </Stack>
          <StatusBar style="auto" />
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
