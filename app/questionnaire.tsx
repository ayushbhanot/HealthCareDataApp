import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
TouchableOpacity, Image 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppTextInput from '@/components/AppTextInput'; 


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

  const [diabetes, setDiabetes] = useState<boolean | null>(false);
  const [hypertension, setHypertension] = useState<boolean | null>(false);
  const [nearsightedness, setNearsightedness] = useState<boolean | null>(false);
  const [farsightedness, setFarsightedness] = useState<boolean | null>(false);
  const [eye_glasses_or_lenses, setEyeGlassesOrLenses] = useState<boolean | null>(false);

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

  const renderBooleanButtons = (
    label: string,
    value: boolean | null,
    setValue: (v: boolean) => void
  ) => (
    <View style={styles.booleanContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.choiceButton,
            value === true && { backgroundColor: '#22c55e' },
          ]}
          onPress={() => setValue(true)}
        >
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.choiceButton,
            value === false && { backgroundColor: '#ef4444' },
          ]}
          onPress={() => setValue(false)}
        >
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  

  return (
    <LinearGradient
      colors={['#1b0d2e', '#2b1550', '#3e207a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
              <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace(`/patients/${patientId}`)} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        </View>
      <ScrollView contentContainerStyle={styles.scroll}>

  
      <LinearGradient colors={['#240046', '#5a189a', '#9d4edd']} style={styles.card}>
          <Text style={styles.title}>Medical History</Text>
  
          <AppTextInput placeholder="Medications" value={medications} onChangeText={setMedications} style={styles.darkPurpleInput}/>
          <AppTextInput placeholder="Allergies" value={allergies} onChangeText={setAllergies} style={styles.darkPurpleInput}/>
          <AppTextInput placeholder="Eye Injuries" value={eye_injuries} onChangeText={setEyeInjuries} style={styles.darkPurpleInput}/>
          <AppTextInput placeholder="Eye Surgeries" value={eye_surgeries} onChangeText={setEyeSurgeries} style={styles.darkPurpleInput}/>
          <AppTextInput placeholder="Social History" value={social_history} onChangeText={setSocialHistory} style={styles.darkPurpleInput}/>
          <AppTextInput placeholder="Family History" value={family_history} onChangeText={setFamilyHistory} style={styles.darkPurpleInput}/>
  
          {/* Custom Boolean Buttons */}
          {renderBooleanButtons('Diabetes', diabetes, setDiabetes)}
{renderBooleanButtons('Hypertension', hypertension, setHypertension)}
{renderBooleanButtons('Nearsightedness', nearsightedness, setNearsightedness)}
{renderBooleanButtons('Farsightedness', farsightedness, setFarsightedness)}
{renderBooleanButtons('Glasses or Lenses', eye_glasses_or_lenses, setEyeGlassesOrLenses)}

  
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleSubmit(historyId ? 'update' : 'submit')}
          >
            <Text style={styles.submitButtonText}>
              {historyId ? 'Update Medical History' : 'Submit Medical History'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    width: '100%',
    paddingTop: 50,
    backgroundColor: '#241b35',
    marginBottom: 0,
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
    backgroundColor: '#2f2542',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#3a2f54',
  },
  title: {
    backgroundColor: '#fe7c3f',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },  
  submitButton: {
    backgroundColor: '#fe7c3f',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  booleanContainer: {
    marginTop: 16,
  },
  label: {
    color: '#f3e8ff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#3e3e3e',
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  darkPurpleInput: {
    backgroundColor: '#2f1d48', 
    borderColor: '#fe7c3f',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 14,
  },
  
  
});
