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
  const [isEditing, setIsEditing] = useState(false);

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={['#240046', '#5a189a', '#9d4edd']}
          style={styles.card}
        >
          {/* ID Image */}
          {patient?.id_image_url && (
            <Image
              source={{ uri: `${API_BASE_URL}${patient.id_image_url}` }}
              style={styles.idImage}
            />
          )}

          {/* Name */}
          <Text style={styles.name}>{patient?.first_name} {patient?.last_name}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Two-column grid */}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{patient?.gender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>DOB</Text>
            <Text style={styles.value}>
              {patient?.dob && new Date(patient.dob).toLocaleDateString('en-US')}
            </Text>
          </View>

          {patient?.contact_number && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{patient.contact_number}</Text>
            </View>
          )}

          {patient?.relative_name && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Relative</Text>
              <Text style={styles.value}>{patient.relative_name}</Text>
            </View>
          )}

          {patient?.relative_phone_number && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Relative No.</Text>
              <Text style={styles.value}>{patient.relative_phone_number}</Text>
            </View>
          )}

          {patient?.language && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Language</Text>
              <Text style={styles.value}>{patient.language}</Text>
            </View>
          )}

          {patient?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{patient.address}</Text>
            </View>
          )}
        </LinearGradient>
        <TouchableOpacity
  style={styles.editButton} onPress={() => router.push(`/patients/edit?id=${id}`)}

 //onPress={() => router.push(`/edit/${id}`)} // or whatever route you choose
>
  <Text style={styles.editButtonText}>Edit Patient Info</Text>
</TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1b0d2e',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
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
    borderRadius: 20,
    padding: 20,
  },
  idImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#fe7c3f',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fe7c3f',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ffffff33',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ccc',
    width: '45%',
  },
  value: {
    fontSize: 15,
    color: '#fff',
    width: '50%',
    textAlign: 'right',
  },

  editButton: {
    marginHorizontal: 0,
    marginTop: 10,
    backgroundColor: '#fe7c3f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    width: '100%'
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});
