import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';

export default function QuestionnaireScreen() {
  const router = useRouter();
  const { id: patientId } = useLocalSearchParams();

  const [historyId, setHistoryId] = useState<string | null>(null);
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [eye_injuries, setEyeInjuries] = useState('');
  const [eye_surgeries, setEyeSurgeries] = useState('');
  const [social_history, setSocialHistory] = useState('');
  const [family_history, setFamilyHistory] = useState('');

  const [diabetes, setDiabetes] = useState<boolean | null>(null);
  const [hypertension, setHypertension] = useState<boolean | null>(null);
  const [nearsightedness, setNearsightedness] = useState<boolean | null>(null);
  const [farsightedness, setFarsightedness] = useState<boolean | null>(null);
  const [eye_glasses_or_lenses, setEyeGlassesOrLenses] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchExistingHistory = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const response = await fetch(`${API_BASE_URL}/patients/medicalHistory/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const existing = data.medical_history[0];
          setHistoryId(existing.history_id);
          setMedications(existing.medications || '');
          setAllergies(existing.allergies || '');
          setEyeInjuries(existing.eye_injuries || '');
          setEyeSurgeries(existing.eye_surgeries || '');
          setSocialHistory(existing.social_history || '');
          setFamilyHistory(existing.family_history || '');
          setDiabetes(existing.diabetes);
          setHypertension(existing.hypertension);
          setNearsightedness(existing.nearsightedness);
          setFarsightedness(existing.farsightedness);
          setEyeGlassesOrLenses(existing.eye_glasses_or_lenses);
        }
      } catch (error) {
        console.error("Failed to fetch existing medical history:", error);
      }
    };
    fetchExistingHistory();
  }, [patientId]);

  const handleSubmit = async (mode: 'submit' | 'update') => {
    const token = await SecureStore.getItemAsync("userToken");
    const payload = {
      patient_id: patientId,
      medications,
      allergies,
      eye_injuries,
      eye_surgeries,
      social_history,
      family_history,
      diabetes,
      hypertension,
      nearsightedness,
      farsightedness,
      eye_glasses_or_lenses,
    };
    const url =
      mode === 'submit'
        ? `${API_BASE_URL}/patients/medicalHistory`
        : `${API_BASE_URL}/patients/updateMedicalHistory/${historyId}`;

    const method = mode === 'submit' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', data.message || 'Medical history saved.');
        router.back();
      } else {
        Alert.alert('Error', data.message || 'Failed to save.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Server connection failed.');
    }
  };

  const renderBooleanButtons = (label: string, value: boolean | null, setValue: (v: boolean) => void) => (
    <View style={styles.booleanContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonRow}>
        <Button title="Yes" onPress={() => setValue(true)} color={value === true ? '#4caf50' : undefined} />
        <Button title="No" onPress={() => setValue(false)} color={value === false ? '#f44336' : undefined} />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Medical History</Text>
      <TextInput placeholder="Medications" style={styles.input} value={medications} onChangeText={setMedications} />
      <TextInput placeholder="Allergies" style={styles.input} value={allergies} onChangeText={setAllergies} />
      <TextInput placeholder="Eye Injuries" style={styles.input} value={eye_injuries} onChangeText={setEyeInjuries} />
      <TextInput placeholder="Eye Surgeries" style={styles.input} value={eye_surgeries} onChangeText={setEyeSurgeries} />
      <TextInput placeholder="Social History" style={styles.input} value={social_history} onChangeText={setSocialHistory} />
      <TextInput placeholder="Family History" style={styles.input} value={family_history} onChangeText={setFamilyHistory} />

      {renderBooleanButtons('Diabetes', diabetes, setDiabetes)}
      {renderBooleanButtons('Hypertension', hypertension, setHypertension)}
      {renderBooleanButtons('Nearsightedness', nearsightedness, setNearsightedness)}
      {renderBooleanButtons('Farsightedness', farsightedness, setFarsightedness)}
      {renderBooleanButtons('Eye Glasses or Lenses', eye_glasses_or_lenses, setEyeGlassesOrLenses)}

      <View style={styles.submitContainer}>
        {!historyId && <Button title="Submit Medical History" onPress={() => handleSubmit('submit')} />}
        {historyId && <Button title="Update Medical History" onPress={() => handleSubmit('update')} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#000',
  },
  submitContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  booleanContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
