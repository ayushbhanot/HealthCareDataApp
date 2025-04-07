// import 'react-native-gesture-handler';
// import 'react-native-reanimated';
// import React, { useEffect } from 'react';
// import { useRouter, useSegments } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   GestureHandlerRootView,
//   PanGestureHandler,
//   GestureHandlerStateChangeEvent,
//   PanGestureHandlerEventPayload,
// } from 'react-native-gesture-handler';
// import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
// import { Tabs } from 'expo-router';
// import Animated, {
//   useSharedValue,
//   withTiming,
//   useAnimatedProps,
//   interpolateColor,
// } from 'react-native-reanimated';

// // Create an animated version of Ionicons
// const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

// const tabRoutes = ['index', 'patients', 'register', 'settings'];


// interface TabBarItemProps {
//   route: any;
//   isFocused: boolean;
//   navigation: any;
//   label: string;
//   iconName: string;
// }

// const TabBarItem = ({ route, isFocused, navigation, label, iconName }: TabBarItemProps) => {
//   // Use a shared value for the animation progress.
//   const progress = useSharedValue(isFocused ? 1 : 0);

//   useEffect(() => {
//     progress.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
//   }, [isFocused, progress]);

//   // Use animated props to update the icon color.
//   const animatedProps = useAnimatedProps(() => ({
//     color: interpolateColor(
//       progress.value,
//       [0, 1],
//       ['gray', '#fd7c3f']
//     ),
//   }));

//   const onPress = () => {
//     const event = navigation.emit({
//       type: 'tabPress',
//       target: route.key,
//     });
//     if (!isFocused && !event.defaultPrevented) {
//       navigation.navigate(route.name);
//     }
//   };

//   return (
//     <TouchableOpacity
//       key={route.key}
//       accessibilityRole="button"
//       accessibilityState={isFocused ? { selected: true } : {}}
//       onPress={onPress}
//       style={styles.tabItem}
//     >
//       <AnimatedIonicons name={iconName as any} size={28} animatedProps={animatedProps} />
//       <Text style={styles.label}>{label}</Text>
//     </TouchableOpacity>
//   );
// };

// export default function TabLayout() {
//   const router = useRouter();
//   const segments = useSegments();
//   const currentTab = segments[1] || 'index';

//   const onSwipe = (e: GestureHandlerStateChangeEvent) => {
//     if (e.nativeEvent.state === 5) {
//       const { translationX } = e.nativeEvent as unknown as PanGestureHandlerEventPayload;
//       const threshold = 50;
//       const currentIndex = tabRoutes.indexOf(currentTab);

//       if (translationX < -threshold && currentIndex < tabRoutes.length - 1) {
//         const newTab = tabRoutes[currentIndex + 1];
//         router.replace(`/(tabs)/${newTab}` as any);
//       } else if (translationX > threshold && currentIndex > 0) {
//         const newTab = tabRoutes[currentIndex - 1];
//         router.replace(newTab === 'index' ? '/(tabs)/index' : `/(tabs)/${newTab}` as any);
//       }
//     }
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <PanGestureHandler onHandlerStateChange={onSwipe}>
//         <View style={{ flex: 1 }}>
//           <Tabs
//             tabBar={({ state, descriptors, navigation }) => (
//               <View style={styles.tabBarContainer}>
//                 {state.routes.map((route) => {
//                   const { options } = descriptors[route.key];
//                   const label = options.title ?? route.name;
//                   const isFocused = state.index === state.routes.indexOf(route);
//                   const iconName =
//                     route.name === 'index'
//                       ? 'home'
//                       : route.name === 'patients'
//                       ? 'people'
//                       : route.name === 'register'
//                       ? 'add-circle'
//                       : 'settings';
//                   return (
//                     <TabBarItem
//                       key={route.key}
//                       route={route}
//                       isFocused={isFocused}
//                       navigation={navigation}
//                       label={label}
//                       iconName={iconName}
//                     />
//                   );
//                 })}
//               </View>
//             )}
//             screenOptions={{
//               headerShown: false,
//             }}
//           >
//             <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
//             <Tabs.Screen name="patients" options={{ title: 'Patients'}} />
//             <Tabs.Screen name="register" options={{ title: 'Register' }} />
//             <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
//           </Tabs>
//         </View>
//       </PanGestureHandler>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   tabBarContainer: {
//     flexDirection: 'row',
//     height: 65,
//     backgroundColor: '#281c34',
//     paddingBottom: 10,
//     borderTopWidth: 0,
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   tabItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//   },
//   label: {
//     color: '#fff',
//     fontSize: 12,
//     marginTop: 2,
//   },
// });


import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  GestureHandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Tabs } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  interpolateColor,
} from 'react-native-reanimated';

// Create an animated version of Ionicons
const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

interface TabBarItemProps {
  route: any;
  isFocused: boolean;
  navigation: any;
  label: string;
  iconName: string;
}

const TabBarItem = ({ route, isFocused, navigation, label, iconName }: TabBarItemProps) => {
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
  }, [isFocused, progress]);

  const animatedProps = useAnimatedProps(() => ({
    color: interpolateColor(progress.value, [0, 1], ['gray', '#fd7c3f']),
  }));

  const onPress = () => {
    const event = navigation.emit({ type: 'tabPress', target: route.key });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <TouchableOpacity
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      style={styles.tabItem}
    >
      <AnimatedIonicons name={iconName as any} size={28} animatedProps={animatedProps} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();
  const currentTab = segments[1] || 'index';

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await SecureStore.getItemAsync('userRole');
      setRole(storedRole);
      setLoading(false);
    };
    fetchRole();
  }, []);

  const isAdmin = role === 'admin';
  const allTabRoutes = ['index', 'patients', 'register', 'settings'];
  const tabRoutes = isAdmin
    ? allTabRoutes
    : allTabRoutes.filter((tab) => tab !== 'settings');

  const onSwipe = (e: GestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === 5) {
      const { translationX } = e.nativeEvent as unknown as PanGestureHandlerEventPayload;
      const threshold = 50;
      const currentIndex = tabRoutes.indexOf(currentTab);

      if (translationX < -threshold && currentIndex < tabRoutes.length - 1) {
        const newTab = tabRoutes[currentIndex + 1];
        router.replace(`/(tabs)/${newTab}` as any);
      } else if (translationX > threshold && currentIndex > 0) {
        const newTab = tabRoutes[currentIndex - 1];
        router.replace(`/(tabs)/${newTab}` as any);
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fd7c3f" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onHandlerStateChange={onSwipe}>
        <View style={{ flex: 1 }}>
          <Tabs
            tabBar={({ state, descriptors, navigation }) => (
              <View style={styles.tabBarContainer}>
                {state.routes
                  .filter((route) => isAdmin || route.name !== 'settings')
                  .map((route) => {
                    const { options } = descriptors[route.key];
                    const label = options.title ?? route.name;
                    const isFocused = state.index === state.routes.indexOf(route);
                    const iconName =
                      route.name === 'index'
                        ? 'stats-chart'
                        : route.name === 'patients'
                        ? 'people'
                        : route.name === 'register'
                        ? 'add-circle'
                        : 'settings';
                    return (
                      <TabBarItem
                        key={route.key}
                        route={route}
                        isFocused={isFocused}
                        navigation={navigation}
                        label={label}
                        iconName={iconName}
                      />
                    );
                  })}
              </View>
            )}
            screenOptions={{ headerShown: false }}
          >
            <Tabs.Screen name="index" options={{ title: 'Analytics' }} />
            <Tabs.Screen name="patients" options={{ title: 'Patients' }} />
            <Tabs.Screen name="register" options={{ title: 'Register' }} />
            {isAdmin && (
              <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
            )}
          </Tabs>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: '#281c34',
    paddingBottom: 10,
    borderTopWidth: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});
