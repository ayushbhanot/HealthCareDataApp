
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';
import AppTextInput from '@/components/AppTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
  const [email, setEmail] = useState('');
  const [idImage, setIdImage] = useState<{ uri: string } | null>(null);

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
        setEmail(p.email || '');
        if (p.id_image_url) {
          setIdImage({ uri: `${API_BASE_URL}${p.id_image_url}` });
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load patient info.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPatient();
  }, [id]);

  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setIdImage(result.assets[0]);
    }
  };
  const validateFields = () => {
        const errors = [];
        if (!firstName) errors.push('First name');
        if (!lastName) errors.push('Last name');
        if (!dob) errors.push('Date of birth');
        if (!gender) errors.push('Gender');
        if (!contactNumber) errors.push('Contact number');
    
        if (errors.length > 0) {
          Alert.alert('Missing Fields', `Please fill in: ${errors.join(', ')}`);
          return false;
        }
        return true;
      };

      const handleUpdate = async () => {
            const token = await SecureStore.getItemAsync('userToken');
          
            if (!firstName || !lastName || !dob || !gender || !contactNumber) {
              Alert.alert('Missing Required Fields', 'Please fill in all required fields.');
              return;
            }
          
            const formData = new FormData();
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('dob', dob);
            formData.append('gender', gender);
            formData.append('contact_number', contactNumber);
            formData.append('relative_name', relativeName);
            formData.append('relative_phone_number', relativePhone);
            formData.append('address', address);
            formData.append('email', email);
          
            if (idImage && idImage.uri && idImage.uri.startsWith('file://')) {
              formData.append('id_image', {
                uri: idImage.uri,
                name: 'id_image.jpg',
                type: 'image/jpeg',
              } as any);
            }
          
            try {
              const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`,
                  // NOTE: Don't manually set 'Content-Type' — it gets set automatically with FormData
                },
                body: formData,
              });
          
              const data = await response.json();
          
              if (response.ok) {
                Alert.alert('Success', 'Patient updated successfully');
                router.replace('/patients');
              } else {
                Alert.alert('Error', data.message || 'Failed to update patient.');
              }
            } catch (err) {
              console.error('Update error:', err);
              Alert.alert('Error', 'An error occurred while updating.');
            }
          };
        

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this patient?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync('userToken');
            await fetch(`${API_BASE_URL}/patients/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Deleted', 'Patient removed successfully.');
            router.replace('/(tabs)/patients');
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not delete patient.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fe7c3f" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#1b0d2e' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace(`/patients/${id}`)} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
  
        <Text style={styles.heading}>Edit Patient Info</Text>
  
        <AppTextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} />
        <AppTextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} />
  
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>
            {dob ? `Date of Birth: ${dob}` : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>
  
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
          themeVariant="light"
          display="spinner"
        />
  
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
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
        <AppTextInput placeholder="Email (Optional)" value={email} onChangeText={setEmail} />
  
        { idImage ? (
  <View style={{ alignItems: 'center', marginVertical: 20 }}>
    <Text style={{ color: '#ccc', marginBottom: 8 }}>Uploaded ID:</Text>
    <Image
      source={{ uri: idImage.uri }}
      style={{ width: '100%', height: 200, borderRadius: 12 }}
      resizeMode="cover"
    />
    <TouchableOpacity
      style={styles.changeImageButton}
      onPress={handleImageChange}
    >
      <Text style={styles.saveButtonText}>Change ID</Text>
    </TouchableOpacity>
  </View>
) : (
  <View style={{ alignItems: 'center', marginVertical: 20 }}>
    <TouchableOpacity
      style={styles.changeImageButton}
      onPress={handleImageChange}
    >
      <Text style={styles.saveButtonText}>Add ID</Text>
    </TouchableOpacity>
  </View>
)}

      </ScrollView>
  
      {/* Fixed bottom buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.halfButton, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.halfButton, styles.saveButton]} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
//   return (
//     <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: '#1b0d2e' }}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="chevron-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
//       </View>
//       <Text style={styles.heading}>Edit Patient Info</Text>

//       <AppTextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} />
//       <AppTextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} />

//       <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
//         <Text style={styles.buttonText}>
//           {dob ? `Date of Birth: ${dob}` : 'Select Date of Birth'}
//         </Text>
//       </TouchableOpacity>

//       <DateTimePickerModal
//         isVisible={showDatePicker}
//         mode="date"
//         onConfirm={(date) => {
//           setShowDatePicker(false);
//           const formatted = date.toISOString().split('T')[0];
//           setDob(formatted);
//         }}
//         onCancel={() => setShowDatePicker(false)}
//         maximumDate={new Date()}
//         themeVariant="dark"
//         display="spinner"
//       />

//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={gender}
//           onValueChange={(value) => setGender(value)}
//           style={styles.picker}
//           itemStyle={styles.pickerItem}
//         >
//           <Picker.Item label="Select Gender" value="" color="#999" />
//           <Picker.Item label="Male" value="Male" />
//           <Picker.Item label="Female" value="Female" />
//           <Picker.Item label="Other" value="Other" />
//         </Picker>
//         <Ionicons name="chevron-down" size={20} color="#666" style={styles.pickerIcon} />
//       </View>

//       <AppTextInput placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} />
//       <AppTextInput placeholder="Relative Name" value={relativeName} onChangeText={setRelativeName} />
//       <AppTextInput placeholder="Relative Phone" value={relativePhone} onChangeText={setRelativePhone} />
//       <AppTextInput placeholder="Address" value={address} onChangeText={setAddress} />
//       <AppTextInput placeholder="Email (Optional)" value={email} onChangeText={setEmail} />

//       {idImage && (
//         <View style={{ alignItems: 'center', marginVertical: 10 }}>
//           <Text style={{ color: '#ccc', marginBottom: 6 }}>Uploaded ID:</Text>
//           <Image
//             source={{ uri: idImage.uri }}
//             style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 12 }}
//             resizeMode="cover"
//           />
// <TouchableOpacity
//   style={[styles.changeImageButton, { backgroundColor: '#444', marginBottom: 10 }]}
//   onPress={handleImageChange}
// >
//   <Text style={styles.saveButtonText}>Change ID</Text>
// </TouchableOpacity>

//         </View>
//       )}

//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={[styles.halfButton, styles.deleteButton]} onPress={handleDelete}>
//           <Text style={styles.deleteButtonText}>Delete</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.halfButton, styles.saveButton]} onPress={handleUpdate}>
//           <Text style={styles.saveButtonText}>Save Changes</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1b0d2e',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fe7c3f',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  halfButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#fe7c3f',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  changeImageButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#444',
  },
  changeImageText: {
    color: '#fff',
    fontSize: 14,
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
  header: {
    height: 90,
    paddingTop: 50,
    backgroundColor: '#241b35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 10,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1b0d2e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  
});

