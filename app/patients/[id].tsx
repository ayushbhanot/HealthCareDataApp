import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants/env';
import * as SecureStore from 'expo-secure-store';

export const screenOptions = {
  headerShown: false,
};
export const options = {
  headerShown: false,
};

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPatient(data.patient);
      } catch (err) {
        console.error('Error fetching patient:', err);
      }
    };

    fetchPatient();
  }, [id]);

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Patient Details</Text>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{id}</Text>

        {patient && (
          <>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{patient.first_name} {patient.last_name}</Text>

            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{patient.gender}</Text>

            <Text style={styles.label}>DOB:</Text>
            <Text style={styles.value}>
              {new Date(patient.dob).toLocaleDateString('en-US')}
            </Text>

            {!!patient.address && (
              <>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{patient.address}</Text>
              </>
            )}

            {patient.id_image_url && (
              <>
                <Text style={styles.label}>ID Image:</Text>
                <Image
                  source={{ uri: `${API_BASE_URL}${patient.id_image_url}` }}
                  style={styles.idImage}
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b0d2e',
  },
  header: {
    height: 90,
    paddingTop: 60, // for safe area
    backgroundColor: '#241b35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 12,
    top: 55,
    zIndex: 10,
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 36,
    width: 120,
    resizeMode: 'contain',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fe7c3f',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    fontWeight: '600',
    marginTop: 12,
  },
  value: {
    color: '#fff',
    fontSize: 16,
  },
  idImage: {
    width: '100%',
    height: 180,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fe7c3f',
  },
});
