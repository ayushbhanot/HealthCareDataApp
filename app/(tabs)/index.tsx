import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { BarChart, LineChart } from "react-native-chart-kit";
import { API_BASE_URL } from "@/constants/env";
import { LinearGradient } from 'expo-linear-gradient';


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
    fetch(`${API_BASE_URL}/analytics/symptoms-list`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item: any) => ({
          label: item.symptom_name,
          value: item.symptom_name,
        }));
        setSymptomOptions(mapped);
        setSelectedSymptoms(mapped.map((s: { value: string }) => s.value)); // ✅ typed
        console.log("✅ Loaded symptoms:", mapped);
      })
      .catch((err) => console.error("❌ Failed to load symptoms:", err));
  
    fetch(`${API_BASE_URL}/analytics/patients-per-month`)
      .then((res) => res.json())
      .then((data) => setMonthlyData(data))
      .catch((err) => console.error("❌ Failed to load monthly data:", err));
  }, []);
  
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      fetch(`${API_BASE_URL}/analytics/symptoms-count`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      })
        .then((res) => res.json())
        .then((data) => {
          setBarData(data);
          console.log("✅ Fetched bar data:", data);
        })
        .catch((err) => {
          console.error("Failed to load symptom counts:", err);
          Alert.alert("Error fetching symptom data");
        });
    }
  }, [selectedSymptoms]);
  

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userRole");
    router.replace("/LoginScreen");
  };
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const storedRole = await SecureStore.getItemAsync("userRole");
        setRole(storedRole);
      } catch (err) {
        console.error("Failed to fetch user role", err);
      } finally {
        setLoading(false); // ensure it's turned off
      }
    };
    getUserRole();
  }, []);
  

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: '#1b0d2e' }} contentContainerStyle={styles.container}>
      {/* <View style={styles.roleContainer}>
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
      </View> */}
      <LinearGradient
  colors={['#240046', '#5a189a', '#9d4edd']}
  style={styles.gradientCard}
>

      
        <Text style={styles.analyticsTitle}>Analytics</Text>
<Text style={styles.subtleText}>Tap to toggle symptoms:</Text>


        <View style={styles.symptomList}>
          {symptomOptions.map((symptom, index) => {
            const selected = selectedSymptoms.includes(symptom.value);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.symptomChip,
                  selected && styles.symptomChipSelected,
                ]}
                onPress={() => {
                  if (selected) {
                    setSelectedSymptoms((prev) =>
                      prev.filter((s) => s !== symptom.value)
                    );
                  } else if (selectedSymptoms.length < 5) {
                    setSelectedSymptoms((prev) => [...prev, symptom.value]);
                  } else {
                    Alert.alert("Limit Reached", "Max 5 symptoms.");
                  }
                }}
              >
                <Text
                  style={[
                    styles.symptomChipText,
                    selected && styles.symptomChipTextSelected,
                  ]}
                >
                  {symptom.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ✅ Dedicated Bar Chart Space */}
        <Text style={styles.chartTitle}>Patients per Selected Symptom</Text>
<View style={styles.chartWrapper}>
  {barData.length > 0 ? (
    <BarChart
      data={{
        labels: barData.map((item) => item.symptom_name),
        datasets: [{ data: barData.map((item) => item.patient_count) }],
      }}
      width={screenWidth - 80} // tighter width
      height={300}
      chartConfig={chartConfig}
      verticalLabelRotation={30}
      yAxisLabel=""
      yAxisSuffix=""
      fromZero
      style={{ borderRadius: 16 }}
    />
  ) : (
    <Text style={styles.noDataText}>No bar chart data yet.</Text>
  )}
</View>

<Text style={styles.chartTitle}>Monthly Patient Registrations</Text>
<View style={styles.chartWrapper}>
  {monthlyData.length > 0 ? (
    <LineChart
      data={{
        labels: monthlyData.map((d) => d.month),
        datasets: [{ data: monthlyData.map((d) => parseInt(d.count)) }],
      }}
      width={screenWidth - 60}
      height={220}
      chartConfig={chartConfig}
      bezier
      fromZero
      style={{ borderRadius: 16 }}
    />
  ) : (
    <Text style={styles.noDataText}>No monthly data.</Text>
  )}
</View>

      </LinearGradient>
      {!role && <Text style={styles.errorText}>Error: No role found.</Text>}

      <View style={styles.logoutButton}>
      <TouchableOpacity style={styles.logoutTouchable} onPress={handleLogout}>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: "#1b0d2e",
  backgroundGradientFrom: "#1b0d2e",
  backgroundGradientTo: "#1b0d2e",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(237, 131, 79, ${opacity})`, // #ED834F
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ED834F",
  },
  propsForBackgroundLines: {
    stroke: "#332244",
  },
  style: {
    borderRadius: 16,
  },
};


const styles = StyleSheet.create({
  container: {
    padding: 0,
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
    color: "#CCCCCC", // lighter gray for subtlety
    textAlign: "center",
    marginBottom: 0,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF", // white text
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.5,
  },  
  chartTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ED834F", // signature accent color
    textAlign: "center",
    marginTop: 30,
    letterSpacing: 0.5,
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
  logoutButton: {
    marginTop: 20,
    width: "80%",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginTop: 20,
  },
  symptomList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#3a2f54",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#a81ee6",
    margin: 4,
  },
  symptomChipSelected: {
    backgroundColor: "#a81ee6",
  },
  symptomChipText: {
    color: "#fff",
    fontWeight: "500",
  },
  symptomChipTextSelected: {
    fontWeight: "bold",
  },
  chart: {
    borderRadius: 16,
    marginTop: 10,
  },
  chartWrapper: {
    backgroundColor: "#1b0d2e",
    borderRadius: 20,
    padding: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  noDataText: {
    color: "#ccc",
    textAlign: "center",
    paddingVertical: 40,
  },
  gradientCard: {
    //width: '100%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 0,
  },

  analyticsTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ED834F",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: 1,
  },
  
  subtleText: {
    fontSize: 14,
    color: "#cccccc",
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },

  logoutTouchable: {
    backgroundColor: "#ED1C24",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  },
  
});
