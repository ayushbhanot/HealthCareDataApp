import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';
import AppTextInput from '@/components/AppTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Appearance } from 'react-native';



export default function EditPatientScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [relativeName, setRelativeName] = useState('');
  const [relativePhone, setRelativePhone] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const p = data.patient;
        setFirstName(p.first_name || '');
        setLastName(p.last_name || '');
        setDob(p.dob || '');
        setGender(p.gender || '');
        setContactNumber(p.contact_number || '');
        setRelativeName(p.relative_name || '');
        setRelativePhone(p.relative_phone_number || '');
        setAddress(p.address || '');
        setLanguage(p.language || '');
      } catch (err) {
        Alert.alert('Error', 'Failed to load patient info.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPatient();
  }, [id]);

  

  const handleUpdate = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          dob,
          gender,
          contact_number: contactNumber,
          relative_name: relativeName,
          relative_phone_number: relativePhone,
          address,
          language,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Patient updated successfully');
        router.back();
      } else {
        Alert.alert('Error', data.message || 'Failed to update patient.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while updating.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fe7c3f" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Patient Info</Text>

      <AppTextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <AppTextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
  <Text style={styles.buttonText}>
    {dob ? `Date of Birth: ${dob}` : 'Select Date of Birth'}
  </Text>
</TouchableOpacity>


      {/* <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        themeVariant="light"
        onConfirm={(date) => {
          setShowDatePicker(false);
          const formatted = date.toISOString().split('T')[0];
          setDob(formatted);
        }}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
      /> */}
<DateTimePickerModal
  isVisible={showDatePicker}
  mode="date"
  onConfirm={(date) => {
    setShowDatePicker(false);
    const formatted = date.toISOString().split('T')[0];
    setDob(formatted);
  }}
  onCancel={() => setShowDatePicker(false)}
  maximumDate={new Date()}
  themeVariant= "dark"
  display="spinner" // forces iOS-like look
/>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(value) => setGender(value)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Select Gender" value="" color="#999" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
        <Ionicons name="chevron-down" size={20} color="#666" style={styles.pickerIcon} />
      </View>

      <AppTextInput placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} />
      <AppTextInput placeholder="Relative Name" value={relativeName} onChangeText={setRelativeName} />
      <AppTextInput placeholder="Relative Phone" value={relativePhone} onChangeText={setRelativePhone} />
      <AppTextInput placeholder="Address" value={address} onChangeText={setAddress} />
      <AppTextInput placeholder="Language" value={language} onChangeText={setLanguage} />

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1b0d2e',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fe7c3f',
    marginBottom: 20,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#fe7c3f',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1b0d2e',
  },
  dateButton: {
    backgroundColor: '#3a2f54',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1.2,
    borderColor: '#a81ee6',
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginBottom: 15,
    height: 70,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 40,
    color: '#000',
  },
  pickerItem: {
    fontSize: 15,
    color: '#000',
    height: 44,
  },
  pickerIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -10,
  },
});
