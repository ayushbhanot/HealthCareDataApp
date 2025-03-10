import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  // Add other patient fields as needed
};

export default function PatientsScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const response = await fetch(`${API_BASE_URL}/patients`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch patients');
        }
        const data = await response.json();
        setPatients(data.patients);
      } catch (error: any) {
        console.error('Error fetching patients:', error);
        setError(error.message);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const renderItem = ({ item }: { item: Patient }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        //onPress={() => router.push(`/questionnaire/${item.id}`)} // Navigate to questionnaire page for selected patient
      >
        <Text style={styles.itemText}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.itemSubText}>DOB: {item.dob}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
         <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Patient</Text>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  listContainer: {
    paddingBottom: 20
  },
  itemContainer: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#f9f9f9'
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemSubText: {
    fontSize: 14,
    color: '#666'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 16
  }
});
