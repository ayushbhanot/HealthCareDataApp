import React, { useState } from 'react';
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
  const { id: patientId, history_id } = useLocalSearchParams();

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

  const handleSubmit = async () => {
    const token = await SecureStore.getItemAsync('userToken');
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

    try {
      const response = await fetch(`${API_BASE_URL}/patients/medicalHistory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message || 'Medical history submitted.');
        router.back();
      } else {
        Alert.alert('Error', data.message || 'Failed to submit.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to connect.');
    }
  };

  const handleUpdate = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    const payload = {
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

    try {
      const response = await fetch(`${API_BASE_URL}/patients/updateMedicalHistory/${history_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message || 'Medical history updated.');
        router.back();
      } else {
        Alert.alert('Error', data.message || 'Failed to update.');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to connect.');
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

      <TextInput
        placeholder="Medications"
        style={styles.input}
        value={medications}
        onChangeText={setMedications}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Allergies"
        style={styles.input}
        value={allergies}
        onChangeText={setAllergies}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Eye Injuries"
        style={styles.input}
        value={eye_injuries}
        onChangeText={setEyeInjuries}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Eye Surgeries"
        style={styles.input}
        value={eye_surgeries}
        onChangeText={setEyeSurgeries}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Social History"
        style={styles.input}
        value={social_history}
        onChangeText={setSocialHistory}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Family History"
        style={styles.input}
        value={family_history}
        onChangeText={setFamilyHistory}
        placeholderTextColor="#999"
      />

      {renderBooleanButtons('Diabetes', diabetes, setDiabetes)}
      {renderBooleanButtons('Hypertension', hypertension, setHypertension)}
      {renderBooleanButtons('Nearsightedness', nearsightedness, setNearsightedness)}
      {renderBooleanButtons('Farsightedness', farsightedness, setFarsightedness)}
      {renderBooleanButtons('Eye Glasses or Lenses', eye_glasses_or_lenses, setEyeGlassesOrLenses)}

      <View style={styles.submitContainer}>
        {!history_id && (
          <Button title="Submit Medical History" onPress={handleSubmit} />
        )}
        {history_id && (
          <Button title="Update Medical History" onPress={handleUpdate} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
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
    gap: 10,
  },
  booleanContainer: {
    //marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
  },
});
