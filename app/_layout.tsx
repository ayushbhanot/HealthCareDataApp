// import { useState, useEffect } from 'react';
// import { useFonts } from 'expo-font';
// import { Stack, useRouter } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import * as SecureStore from 'expo-secure-store';
// import {
//   GestureHandlerStateChangeEvent,
//   PanGestureHandlerEventPayload,
//   PanGestureHandler,
//   GestureHandlerRootView,
// } from 'react-native-gesture-handler';
// import { View, StyleSheet, Image } from 'react-native';



// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const router = useRouter();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//   const [checkingAuth, setCheckingAuth] = useState(true); // Prevent re-renders during auth check
//   const [swipeDirection, setSwipeDirection] = useState<string | null>(null); // Track swipe direction

//   useEffect(() => {
//     const checkLogin = async () => {
//       const token = await SecureStore.getItemAsync("userToken");
//       setIsAuthenticated(!!token);
//       setCheckingAuth(false); // Mark authentication check as complete
//     };

//     checkLogin();
//   }, []);

//   useEffect(() => {
//     if (loaded && !checkingAuth) {
//       SplashScreen.hideAsync();
//       setTimeout(async () => {
//         await SplashScreen.hideAsync();
//         if (isAuthenticated === false) {
//           router.replace("/LoginScreen"); // Redirect once auth check completes
//         }
//       }, 0);
//     }
//   }, [loaded, isAuthenticated, checkingAuth]);

//   // Remove generic from the event type and cast nativeEvent to access translationX
//   const onSwipe = (e: GestureHandlerStateChangeEvent) => {
//     // Cast nativeEvent to unknown then to PanGestureHandlerEventPayload
//     const { translationX } = e.nativeEvent as unknown as PanGestureHandlerEventPayload;
//     const threshold = 50; // Adjust sensitivity as needed
  
//     if (translationX < -threshold) {
//       // Handle left swipe
//       console.log('Swiped left');
//     } else if (translationX > threshold) {
//       // Handle right swipe
//       console.log('Swiped right');
//     }
//   };

//   if (!loaded || checkingAuth) {
//     return null; // Wait for authentication check to complete
//   }
//   return (
//     <Stack>
//       {!isAuthenticated ? (
//         <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
//       ) : (
//         <Stack.Screen 
//           name="(tabs)" 
//           options={{
//             headerShown: true,
//             headerStyle: { backgroundColor: '#241b35' },
//             headerTitle: () => (
//               <Image
//                 source={require('../assets/images/icon.png')}
//                 style={{ width: 120, height: 40, resizeMode: 'contain' }}
//               />
//             ),
//             headerTitleAlign: 'center',
//           }}
//         />
//       )}
//       <StatusBar style="auto" />
//     </Stack>
//   );
// }

// //   return (
// //     <GestureHandlerRootView style={styles.container}>
// //       <PanGestureHandler onHandlerStateChange={onSwipe}>
// //         <View style={{ flex: 1 }}>
// //           <Stack>
// //             {!isAuthenticated ? (
// //               <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
// //             ) : (
// //               <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
// //             )}
// //           </Stack>
// //           <StatusBar style="auto" />
// //         </View>
// //       </PanGestureHandler>
// //     </GestureHandlerRootView>
// //   );
// // }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

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
