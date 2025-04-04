import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants/env';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View style={styles.screen}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      </View>

      {/* Gradient card container */}
      <LinearGradient
        colors={['#240046', '#5a189a', '#9d4edd']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1b0d2e', // Dark background
  },
  header: {
    height: 90,
    paddingTop: 50,
    backgroundColor: '#241b35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 50,
    zIndex: 10,
  },
  logo: {
    height: 36,
    width: 120,
    resizeMode: 'contain',
  },
  card: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  content: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#fe7c3f',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: '#ddd',
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
