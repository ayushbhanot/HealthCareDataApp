// import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
// import * as SecureStore from "expo-secure-store";
// import { useRouter } from "expo-router";
// import { useState, useEffect } from "react";

// export default function Dashboard() {
//   const router = useRouter();
//   const [role, setRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getUserRole = async () => {
//       const storedRole = await SecureStore.getItemAsync("userRole");
//       setRole(storedRole);
//       setLoading(false);
//     };
//     getUserRole();
//   }, []);

//   const handleLogout = async () => {
//     await SecureStore.deleteItemAsync("userToken");
//     await SecureStore.deleteItemAsync("refreshToken");
//     await SecureStore.deleteItemAsync("userRole");
//     router.replace("/LoginScreen");
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {role === "admin" && (
//         <View style={styles.roleContainer}>
//           <Text style={styles.title}>👑 Admin Dashboard</Text>
//           <Text style={styles.subtitle}>Manage users, view analytics, and oversee patient records.</Text>
//         </View>
//       )}

//       {role === "doctor" && (
//         <View style={styles.roleContainer}>
//           <Text style={styles.title}>🩺 Doctor Dashboard</Text>
//           <Text style={styles.subtitle}>View & update your assigned patients, exams, and history.</Text>
//         </View>
//       )}

//       {role === "staff" && (
//         <View style={styles.roleContainer}>
//           <Text style={styles.title}>🏥 Staff Dashboard</Text>
//           <Text style={styles.subtitle}>Register new patients and update demographics.</Text>
//         </View>
//       )}

//       {!role && <Text style={styles.errorText}>Error: No role found.</Text>}

//       <View style={styles.logoutButton}>
//         <Button title="Logout" onPress={handleLogout} color="red" />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     justifyContent: "center", 
//     alignItems: "center", 
//     padding: 20 
//   },
//   roleContainer: {
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   title: { 
//     fontSize: 28, 
//     fontWeight: "bold", 
//     marginBottom: 5 
//   },
//   subtitle: { 
//     fontSize: 18, 
//     color: "gray", 
//     textAlign: "center", 
//     marginHorizontal: 10 
//   },
//   errorText: {
//     fontSize: 16,
//     color: "red",
//     fontWeight: "bold",
//     marginTop: 20,
//   },
//   logoutButton: {
//     marginTop: 20,
//     width: "80%",
//   },
// });


import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import { BarChart, LineChart } from "react-native-chart-kit";
import { API_BASE_URL } from "@/constants/env"; // ✅ Use env config

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [symptomOptions, setSymptomOptions] = useState<any[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    const getUserRole = async () => {
      const storedRole = await SecureStore.getItemAsync("userRole");
      setRole(storedRole);
      setLoading(false);
    };
    getUserRole();
  }, []);

  useEffect(() => {
    // Fetch symptom options
    fetch(`${API_BASE_URL}/analytics/symptoms-list`)
      .then((res) => res.json())
      .then((data) =>
        setSymptomOptions(
          data.map((item: any) => ({
            label: item.symptom_name,
            value: item.symptom_name,
          }))
        )
      )
      .catch((err) => console.error("Failed to load symptoms:", err));

    // Fetch monthly patient data
    fetch(`${API_BASE_URL}/analytics/patients-per-month`)
      .then((res) => res.json())
      .then((data) => setMonthlyData(data))
      .catch((err) => console.error("Failed to load monthly data:", err));
  }, []);

  const fetchBarData = () => {
    if (selectedSymptoms.length === 0 || selectedSymptoms.length > 5) {
      Alert.alert("Select 1 to 5 symptoms.");
      return;
    }

    fetch(`${API_BASE_URL}/analytics/symptoms-count`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: selectedSymptoms }),
    })
      .then((res) => res.json())
      .then((data) => setBarData(data))
      .catch((err) => {
        console.error("Failed to load symptom counts:", err);
        Alert.alert("Error fetching symptom data");
      });
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userRole");
    router.replace("/LoginScreen");
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.roleContainer}>
        <Text style={styles.title}>📊 Dashboard</Text>
        {role === "admin" && (
          <Text style={styles.subtitle}>
            👑 Admin - Manage users, view analytics, and oversee patient records.
          </Text>
        )}
        {role === "doctor" && (
          <Text style={styles.subtitle}>
            🩺 Doctor - View & update your assigned patients, exams, and history.
          </Text>
        )}
        {role === "staff" && (
          <Text style={styles.subtitle}>
            🏥 Staff - Register new patients and update demographics.
          </Text>
        )}
      </View>

      <View style={styles.dashboardCard}>
        <Text style={styles.sectionTitle}>📈 Analytics Dashboard</Text>

        <Text style={styles.sectionTitle}>Select up to 5 Symptoms:</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            if (
              value &&
              !selectedSymptoms.includes(value) &&
              selectedSymptoms.length < 5
            ) {
              setSelectedSymptoms([...selectedSymptoms, value]);
            }
          }}
          items={symptomOptions}
          placeholder={{ label: "Select symptom...", value: null }}
        />

        <View style={styles.selectedSymptoms}>
          {selectedSymptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomBadge}>
              <Text>{symptom}</Text>
            </View>
          ))}
          {selectedSymptoms.length > 0 && (
            <Button title="Clear" onPress={() => setSelectedSymptoms([])} />
          )}
        </View>

        <Button title="Show Bar Chart" onPress={fetchBarData} />

        {barData.length > 0 && (
          <>
            <Text style={styles.chartTitle}>Patients per Selected Symptom</Text>
            <BarChart
              data={{
                labels: barData.map((item) => item.symptom_name),
                datasets: [{ data: barData.map((item) => item.patient_count) }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
              style={styles.chart}
            />
          </>
        )}

        {monthlyData.length > 0 && (
          <>
            <Text style={styles.chartTitle}>Monthly Patient Registrations</Text>
            <LineChart
              data={{
                labels: monthlyData.map((d) => d.month),
                datasets: [{ data: monthlyData.map((d) => parseInt(d.count)) }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              yAxisLabel=""
              yAxisSuffix=""
              style={styles.chart}
            />
          </>
        )}
      </View>

      {!role && <Text style={styles.errorText}>Error: No role found.</Text>}

      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#f7f7f7",
  backgroundGradientTo: "#eaeaea",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "2", stroke: "#007AFF" },
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  roleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  selectedSymptoms: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    gap: 6,
  },
  symptomBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    marginRight: 5,
  },
  chartTitle: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  dashboardCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 20,
    width: "80%",
  },
});
