import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';

export default function QuestionnaireScreen() {
  const router = useRouter(); // Navigation instance

  const [lossOfVision, setLossOfVision] = useState<boolean | null>(null);
  const [whichEye, setWhichEye] = useState<string | null>(null);
  const [pain, setPain] = useState<boolean | null>(null);
  const [redness, setRedness] = useState<boolean | null>(null);
  const [watering, setWatering] = useState<boolean | null>(null);
  const [dischargeType, setDischargeType] = useState<string | null>(null);
  const [itching, setItching] = useState<boolean | null>(null);
  const [htn, setHtn] = useState<boolean | null>(null);
  const [dm, setDm] = useState<boolean | null>(null);
  const [heartDisease, setHeartDisease] = useState<boolean | null>(null);
  const [allergyDrops, setAllergyDrops] = useState<boolean | null>(null);

  // Function to submit (without patient ID)
  const submitSymptoms = async () => {
    const symptoms = [];

    if (lossOfVision) symptoms.push('Loss of Vision');
    if (whichEye) symptoms.push(`Vision Loss in ${whichEye} Eye`);
    if (pain) symptoms.push('Pain in Eye');
    if (redness) symptoms.push('Redness in Eye');
    if (watering) symptoms.push('Watering in Eye');
    if (dischargeType) symptoms.push(`Discharge Type: ${dischargeType}`);
    if (itching) symptoms.push('Itching in Eye');
    if (htn) symptoms.push('Hypertension');
    if (dm) symptoms.push('Diabetes');
    if (heartDisease) symptoms.push('Heart Disease');
    if (allergyDrops) symptoms.push('Allergy to Drops');

    if (symptoms.length === 0) {
      Alert.alert('Error', 'Please select at least one symptom before submitting.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${API_BASE_URL}/save-symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ symptoms }), // No patient ID included
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Symptoms saved successfully.');
      } else {
        Alert.alert('Error', data.message || 'Failed to save symptoms.');
      }
    } catch (error) {
      console.error('Error submitting symptoms:', error);
      Alert.alert('Error', 'Failed to connect to the server.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Patient Symptoms Collection</Text>

      {/* Back Button */}
      <Button title="Back to Patients" onPress={() => router.back()} />

      {/* Medical History - Loss of Vision */}
      <Text style={styles.question}>Loss of Vision?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Yes" onPress={() => setLossOfVision(true)} />
        <Button title="No" onPress={() => setLossOfVision(false)} />
      </View>

      {lossOfVision && (
        <>
          <Text style={styles.question}>Which Eye?</Text>
          <View style={styles.buttonContainer}>
            <Button title="R" onPress={() => setWhichEye('R')} />
            <Button title="L" onPress={() => setWhichEye('L')} />
            <Button title="Both" onPress={() => setWhichEye('Both')} />
          </View>

          <Text style={styles.question}>Pain?</Text>
          <View style={styles.buttonContainer}>
            <Button title="Yes" onPress={() => setPain(true)} />
            <Button title="No" onPress={() => setPain(false)} />
          </View>
        </>
      )}

      {/* Systemic History */}
      <Text style={styles.question}>Hypertension (HTN)?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Yes" onPress={() => setHtn(true)} />
        <Button title="No" onPress={() => setHtn(false)} />
      </View>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button title="Submit Symptoms" onPress={submitSymptoms} />
      </View>

      <Text style={styles.footer}>End of Form</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  question: { fontSize: 18, marginTop: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  submitContainer: { marginTop: 20, alignItems: 'center' },
  footer: { marginTop: 20, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
});
