import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants/env';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';



export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any[] | null>(null);
  const [symptoms, setSymptoms] = useState<string[] | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchDetails = async () => {
        try {
          const token = await SecureStore.getItemAsync('userToken');
  
          const [patientRes, historyRes, symptomRes] = await Promise.all([
            fetch(`${API_BASE_URL}/patients/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/patients/medicalHistory/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/patients/symptoms/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);
  
          const patientData = await patientRes.json();
          const historyData = await historyRes.json();
          const symptomData = await symptomRes.json();
  
          setPatient(patientData.patient);
          setMedicalHistory(historyData.medical_history || []);
          setSymptoms(symptomData.symptoms?.map((s: any) => s.symptom_name) || []);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      };
  
      fetchDetails();
    }, [id])
  );
  

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');

        const [patientRes, historyRes, symptomRes] = await Promise.all([
          fetch(`${API_BASE_URL}/patients/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/patients/medicalHistory/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/patients/symptoms/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const patientData = await patientRes.json();
        const historyData = await historyRes.json();
        const symptomData = await symptomRes.json();

        setPatient(patientData.patient);
        setMedicalHistory(historyData.medical_history || []);
        setSymptoms(symptomData.symptoms?.map((s: any) => s.symptom_name) || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/patients')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={['#240046', '#5a189a', '#9d4edd']} style={styles.card}>
          {patient?.id_image_url && (
            <Image source={{ uri: `${API_BASE_URL}${patient.id_image_url}` }} style={styles.idImage} />
          )}

          <Text style={styles.name}>{patient?.first_name} {patient?.last_name}</Text>
          <View style={styles.divider} />

          <View style={styles.infoRow}><Text style={styles.label}>Gender</Text><Text style={styles.value}>{patient?.gender}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>DOB</Text><Text style={styles.value}>{patient?.dob && new Date(patient.dob).toLocaleDateString('en-US')}</Text></View>
          {patient?.contact_number && (<View style={styles.infoRow}><Text style={styles.label}>Phone</Text><Text style={styles.value}>{patient.contact_number}</Text></View>)}
          {patient?.relative_name && (<View style={styles.infoRow}><Text style={styles.label}>Relative</Text><Text style={styles.value}>{patient.relative_name}</Text></View>)}
          {patient?.relative_phone_number && (<View style={styles.infoRow}><Text style={styles.label}>Relative No.</Text><Text style={styles.value}>{patient.relative_phone_number}</Text></View>)}
          {patient?.language && (<View style={styles.infoRow}><Text style={styles.label}>Language</Text><Text style={styles.value}>{patient.language}</Text></View>)}
          {patient?.address && (<View style={styles.infoRow}><Text style={styles.label}>Address</Text><Text style={styles.value}>{patient.address}</Text></View>)}
        </LinearGradient>

        <TouchableOpacity
  style={styles.editButton}
  onPress={() => router.push(`/patients/edit?id=${id}`)}
>
  <Text style={styles.editButtonText}>Edit Patient Info</Text>
</TouchableOpacity>

        {/* {medicalHistory && medicalHistory.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Medical History:</Text>
            {medicalHistory.map((entry, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.historyItem}>• Medications: {entry.medications || 'None'}</Text>
                <Text style={styles.historyItem}>• Allergies: {entry.allergies || 'None'}</Text>
                <Text style={styles.historyItem}>• Eye Injuries: {entry.eye_injuries || 'None'}</Text>
                <Text style={styles.historyItem}>• Eye Surgeries: {entry.eye_surgeries || 'None'}</Text>
                <Text style={styles.historyItem}>• Social History: {entry.social_history || 'None'}</Text>
                <Text style={styles.historyItem}>• Family History: {entry.family_history || 'None'}</Text>
                <Text style={styles.historyItem}>• Diabetes: {entry.diabetes ? 'Yes' : 'No'}</Text>
                <Text style={styles.historyItem}>• Hypertension: {entry.hypertension ? 'Yes' : 'No'}</Text>
                <Text style={styles.historyItem}>• Nearsightedness: {entry.nearsightedness ? 'Yes' : 'No'}</Text>
                <Text style={styles.historyItem}>• Farsightedness: {entry.farsightedness ? 'Yes' : 'No'}</Text>
                <Text style={styles.historyItem}>• Eye Glasses/Lenses: {entry.eye_glasses_or_lenses ? 'Yes' : 'No'}</Text>
              </View>
            ))}
          </View> */}
          {medicalHistory && medicalHistory.length > 0 && (
            <LinearGradient colors={['#240046', '#5a189a', '#9d4edd']} style={styles.sectionCard}>
  <Text style={styles.sectionTitle}>Medical History</Text>
  <View style={styles.sectionDivider} />
  {medicalHistory.map((entry, index) => (
  <View key={index}>
    <View style={styles.infoRow}><Text style={styles.label}>Medications</Text><Text style={styles.value}>{entry.medications || 'None'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Allergies</Text><Text style={styles.value}>{entry.allergies || 'None'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Eye Injuries</Text><Text style={styles.value}>{entry.eye_injuries || 'None'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Eye Surgeries</Text><Text style={styles.value}>{entry.eye_surgeries || 'None'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Social History</Text><Text style={styles.value}>{entry.social_history || 'None'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Family History</Text><Text style={styles.value}>{entry.family_history || 'None'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Diabetes</Text><Text style={styles.value}>{entry.diabetes ? 'Yes' : 'No'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Hypertension</Text><Text style={styles.value}>{entry.hypertension ? 'Yes' : 'No'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Nearsightedness</Text><Text style={styles.value}>{entry.nearsightedness ? 'Yes' : 'No'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Farsightedness</Text><Text style={styles.value}>{entry.farsightedness ? 'Yes' : 'No'}</Text></View>
    <View style={styles.infoRow}><Text style={styles.label}>Glasses/Lenses</Text><Text style={styles.value}>{entry.eye_glasses_or_lenses ? 'Yes' : 'No'}</Text></View>
  </View>
))}
</LinearGradient>

)}


        <TouchableOpacity
          style={[styles.editButton]}
          onPress={() => {
            const hasHistory = medicalHistory && medicalHistory.length > 0;
            const historyId = hasHistory ? medicalHistory[0].history_id : '';
            const action = hasHistory ? 'edit' : 'submit';
            router.push(`/questionnaire?id=${id}&action=${action}&history_id=${historyId}`);
          }}
        >
          <Text style={styles.editButtonText}>
            {medicalHistory && medicalHistory.length > 0 ? 'Edit Medical History' : 'Submit Medical History'}
          </Text>
        </TouchableOpacity>

        {/* <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Patient Current Symptoms:</Text>
          {symptoms && symptoms.length > 0 ? (
            symptoms.map((symptom, idx) => (
              <Text key={idx} style={styles.historyItem}>• {symptom}</Text>
            ))
          ) : (
            <Text style={styles.historyItem}>None</Text>
          )}
        </View> */}
      
        <LinearGradient colors={['#240046', '#5a189a', '#9d4edd']} style={styles.sectionCard}>
  <Text style={styles.sectionTitle}>Current Symptoms</Text>
  <View style={styles.sectionDivider} />
  {symptoms && symptoms.length > 0 ? (
  symptoms.map((symptom, idx) => (
    <View key={idx} style={styles.infoRow}>
      <Text style={styles.label}>Symptom</Text>
      <Text style={styles.value}>{symptom}</Text>
    </View>
  ))
) : (
  <View style={styles.infoRow}>
    <Text style={styles.label}>Symptom</Text>
    <Text style={styles.value}>None</Text>
  </View>
)}

</LinearGradient>



        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: '#22c55e' }]}
          onPress={() => router.push(`/patients/addSymptom?id=${id}`)}
        >
          <Text style={styles.editButtonText}>Add Symptom</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1b0d2e' },
  scroll: { padding: 20, paddingBottom: 40 },
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
  backButton: { position: 'absolute', left: 16, top: 50, zIndex: 10 },
  logo: { height: 36, width: 120, resizeMode: 'contain' },
  card: { borderRadius: 20, padding: 20 },
  idImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#fe7c3f',
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fe7c3f', textAlign: 'center', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#ffffff33', marginVertical: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  label: { fontSize: 15, fontWeight: '600', color: '#ccc', width: '45%' },
  value: { fontSize: 15, color: '#fff', width: '50%', textAlign: 'right' },
  editButton: {
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
    width: '100%',
  },
  editButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  historyCard: {
    backgroundColor: '#3e2f5a',
    padding: 16,
    borderRadius: 12,
    borderColor: '#a81ee6',
    borderWidth: 1,
    marginTop: 20,
  },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#fe7c3f', marginBottom: 8 },
  historyItem: { fontSize: 15, color: '#eee', marginBottom: 4 },
  sectionCard: {
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    backgroundColor: '#2f1d48',
    borderColor: '#a81ee6',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fe7c3f',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  sectionDivider: {
    height: 1,
    backgroundColor: '#ffffff33',
    marginBottom: 14,
  },
  
  sectionItem: {
    fontSize: 15,
    color: '#eee',
    marginBottom: 8,
  },  
  
});
