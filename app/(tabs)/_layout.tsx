// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { View, Text, StyleSheet } from "react-native";

// const Tab = createMaterialTopTabNavigator();

// // 🔹 Placeholder Screens
// const PlaceholderScreen = ({ title }: { title: string }) => (
//   <View style={styles.container}>
//     <Text style={styles.title}>{title}</Text>
//     <Text style={styles.subtitle}>This screen is under construction.</Text>
//   </View>
// );

// export default function TabLayout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Tabs
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ color }) => {
//             let iconName: keyof typeof Ionicons.glyphMap = "help-circle";
//             if (route.name === "index") {
//               iconName = "home";
//             } else if (route.name === "patients") {
//               iconName = "people";
//             } else if (route.name === "register") {
//               iconName = "add-circle";
//             } else if (route.name === "settings") {
//               iconName = "settings";
//             }
//             return <Ionicons name={iconName} size={28} color={color} />;
//           },
//           tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
//           tabBarActiveTintColor: "#007AFF",
//           tabBarInactiveTintColor: "gray",
//           tabBarStyle: { height: 65, paddingBottom: 10 },
//           headerShown: false,
//         })}
//       >
//         <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
//         <Tabs.Screen name="patients" options={{ title: "Patients" }} />
//         <Tabs.Screen name="register" options={{ title: "Register" }} />
//         <Tabs.Screen name="settings" options={{ title: "Settings" }} />
//       </Tabs>
//     </GestureHandlerRootView>
//   );
// }

// // 🔹 Styles for Placeholder Screens
// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
//   subtitle: { fontSize: 16, color: "gray" },
// });

import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  GestureHandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { View } from 'react-native';
import { Tabs } from 'expo-router';

// Define your tab order – ensure these match your file names/routes exactly.
const tabRoutes = ['index', 'patients', 'register', 'settings'];

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();
  // Derive current tab from segments; segments[1] should be the active tab.
  const currentTab = segments[1] || 'index';

  const onSwipe = (e: GestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === 5) { // Only act when the gesture has ended
      const { translationX } = e.nativeEvent as unknown as PanGestureHandlerEventPayload;
      const threshold = 50;
      const currentIndex = tabRoutes.indexOf(currentTab);

      if (translationX < -threshold && currentIndex < tabRoutes.length - 1) {
        // Swipe left: move to the next tab
        const newTab = tabRoutes[currentIndex + 1];
        router.push(`/(tabs)/${newTab}` as any);
      } else if (translationX > threshold && currentIndex > 0) {
        // Swipe right: move to the previous tab
        const newTab = tabRoutes[currentIndex - 1];
        if (newTab === 'index') {
          // For the index route, use the parent path for tabs.
          router.push('/(tabs)');
        } else {
          router.push(`/(tabs)/${newTab}` as any);
        }
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onHandlerStateChange={onSwipe}>
        <View style={{ flex: 1 }}>
          <Tabs
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color }) => {
                let iconName: keyof typeof Ionicons.glyphMap = 'home';
                if (route.name === 'index') iconName = 'home';
                else if (route.name === 'patients') iconName = 'people';
                else if (route.name === 'register') iconName = 'add-circle';
                else if (route.name === 'settings') iconName = 'settings';
                return <Ionicons name={iconName} size={28} color={color} />;
              },
              tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: { height: 65, paddingBottom: 10 },
              headerShown: false,
            })}
          >
            <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
            <Tabs.Screen name="patients" options={{ title: 'Patients' }} />
            <Tabs.Screen name="register" options={{ title: 'Register' }} />
            <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
          </Tabs>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
