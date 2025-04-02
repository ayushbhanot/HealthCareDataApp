// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   Alert,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-picker/picker';
// import * as SecureStore from 'expo-secure-store';
// import { API_BASE_URL } from "@/constants/env";

// export default function RegisterPatient() {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [dob, setDob] = useState('');
//   const [gender, setGender] = useState('');
//   const [contactNumber, setContactNumber] = useState('');
//   const [relativeName, setRelativeName] = useState('');
//   const [relativePhoneNumber, setRelativePhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [longitude, setLongitude] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   // Validation function
//   const validateForm = () => {
//     let valid = true;
//     let errors: { [key: string]: string } = {};

//     if (!firstName) {
//       valid = false;
//       errors.firstName = 'First name is required';
//     }
//     if (!lastName) {
//       valid = false;
//       errors.lastName = 'Last name is required';
//     }
//     if (!dob) {
//       valid = false;
//       errors.dob = 'Date of birth is required';
//     }
//     if (!gender) {
//       valid = false;
//       errors.gender = 'Gender is required';
//     }
//     if (!contactNumber) {
//       valid = false;
//       errors.contactNumber = 'Contact number is required';
//     }
//     if (relativePhoneNumber && !relativeName) {
//       valid = false;
//       errors.relativeName = 'Relative name is required if phone number is provided';
//     }
//     if (email && !email.includes('@')) {
//       valid = false;
//       errors.email = 'Please provide a valid email address';
//     }
//     if (!address && (!longitude || !latitude)) {
//       valid = false;
//       errors.address = 'Please provide either an address or GIS location (longitude and latitude)';
//     }

//     setErrors(errors);
//     return valid;
//   };

//   const handleRegisterPatient = async () => {
//     if (validateForm()) {
//       try {
//         const token = await SecureStore.getItemAsync("userToken");
//         const response = await fetch(`${API_BASE_URL}/patients`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             first_name: firstName,
//             last_name: lastName,
//             dob,
//             gender,
//             contact_number: contactNumber,
//             relative_name: relativeName,
//             relative_phone_number: relativePhoneNumber,
//             email,
//             address,
//             longitude,
//             latitude,
//           }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//           Alert.alert('Patient registered successfully');
//         } else {
//           console.error('Error registering patient:', data.message);
//           Alert.alert('Error', data.message || 'Something went wrong while registering the patient.');
//         }
//       } catch (error) {
//         console.error('Network Error:', error);
//         Alert.alert('Error', 'Failed to register patient. Please try again later.');
//       }
//     } else {
//       Alert.alert('Please fill in all required fields.');
//     }
//   };

//   const onChangeDate = (event: any, selectedDate?: Date) => {
//     // On Android, the picker automatically dismisses; on iOS, we toggle the state
//     setShowDatePicker(Platform.OS === 'ios');
//     if (selectedDate) {
//       // Format date to YYYY-MM-DD
//       setDob(selectedDate.toISOString().split('T')[0]);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.formContainer}>
//         <Text style={styles.title}>Register New Patient</Text>

//         {/* First Name */}
//         <TextInput
//           style={[styles.input, errors.firstName && styles.errorInput]}
//           placeholder="First Name"
//           value={firstName}
//           onChangeText={setFirstName}
//         />
//         {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

//         {/* Last Name */}
//         <TextInput
//           style={[styles.input, errors.lastName && styles.errorInput]}
//           placeholder="Last Name"
//           value={lastName}
//           onChangeText={setLastName}
//         />
//         {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

//         {/* Date of Birth */}
//         <Button title="Select Date of Birth" onPress={() => setShowDatePicker(true)} />
//         {dob ? <Text>Selected Date: {dob}</Text> : <Text style={styles.errorText}>{errors.dob}</Text>}
//         {showDatePicker && (
//           <DateTimePicker
//             value={new Date()}
//             mode="date"
//             display="default"
//             onChange={onChangeDate}
//           />
//         )}
//         {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

//         {/* Gender */}
//         <Picker
//           selectedValue={gender}
//           onValueChange={(itemValue) => setGender(itemValue)}
//           style={[styles.input, errors.gender && styles.errorInput]}
//         >
//           <Picker.Item label="Select Gender" value="" />
//           <Picker.Item label="Male" value="Male" />
//           <Picker.Item label="Female" value="Female" />
//         </Picker>
//         {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

//         {/* Contact Number */}
//         <TextInput
//           style={[styles.input, errors.contactNumber && styles.errorInput]}
//           placeholder="Contact Number"
//           value={contactNumber}
//           onChangeText={setContactNumber}
//         />
//         {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

//         {/* Relative Name */}
//         <TextInput
//           style={[styles.input, errors.relativeName && styles.errorInput]}
//           placeholder="Relative's Name"
//           value={relativeName}
//           onChangeText={setRelativeName}
//         />
//         {errors.relativeName && <Text style={styles.errorText}>{errors.relativeName}</Text>}

//         {/* Relative Phone Number */}
//         <TextInput
//           style={[styles.input, errors.relativePhoneNumber && styles.errorInput]}
//           placeholder="Relative's Phone Number"
//           value={relativePhoneNumber}
//           onChangeText={setRelativePhoneNumber}
//         />
//         {errors.relativePhoneNumber && <Text style={styles.errorText}>{errors.relativePhoneNumber}</Text>}

//         {/* Email */}
//         <TextInput
//           style={[styles.input, errors.email && styles.errorInput]}
//           placeholder="Email (Optional)"
//           value={email}
//           onChangeText={setEmail}
//         />
//         {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

//         {/* Address */}
//         <TextInput
//           style={[styles.input, errors.address && styles.errorInput]}
//           placeholder="Address (Optional)"
//           value={address}
//           onChangeText={setAddress}
//         />
//         {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

//         {/* Longitude / Latitude if address not provided */}
//         {!address && (
//           <>
//             <TextInput
//               style={[styles.input, errors.longitude && styles.errorInput]}
//               placeholder="Longitude (GIS Location)"
//               value={longitude}
//               onChangeText={setLongitude}
//             />
//             {errors.longitude && <Text style={styles.errorText}>{errors.longitude}</Text>}

//             <TextInput
//               style={[styles.input, errors.latitude && styles.errorInput]}
//               placeholder="Latitude (GIS Location)"
//               value={latitude}
//               onChangeText={setLatitude}
//             />
//             {errors.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
//           </>
//         )}

//         <Button title="Register Patient" onPress={handleRegisterPatient} />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     // This ensures the content can scroll if it exceeds screen size
//     flexGrow: 1,
//     // Center the form horizontally and (optionally) vertically
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   formContainer: {
//     // Constrain width so it doesn't stretch the entire screen
//     width: '90%',
//     maxWidth: 400,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,

//     // (Optional) Shadow on iOS
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,

//     // (Optional) Elevation on Android
//     elevation: 2,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     width: '100%',
//     minHeight: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   errorInput: {
//     borderColor: 'red',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginBottom: 10,
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import AppTextInput from '../../components/AppTextInput';

export default function RegisterPatient() {
  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [relativeName, setRelativeName] = useState('');
  const [relativePhoneNumber, setRelativePhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Wizard step (1 to 5)
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Validate fields for the current step
  const validateStep = () => {
    let valid = true;
    let stepErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!firstName) {
        valid = false;
        stepErrors.firstName = 'First name is required';
      }
      if (!lastName) {
        valid = false;
        stepErrors.lastName = 'Last name is required';
      }
      if (!dob) {
        valid = false;
        stepErrors.dob = 'Date of birth is required';
      }
      if (!gender) {
        valid = false;
        stepErrors.gender = 'Gender is required';
      }
    }

    if (step === 2) {
      if (!contactNumber) {
        valid = false;
        stepErrors.contactNumber = 'Contact number is required';
      }
      // Optionally validate email format
      if (email && !email.includes('@')) {
        valid = false;
        stepErrors.email = 'Please provide a valid email address';
      }
    }

    if (step === 3) {
      // If relative phone is provided, relative name must be provided.
      if (relativePhoneNumber && !relativeName) {
        valid = false;
        stepErrors.relativeName = 'Relative name is required if phone number is provided';
      }
    }

    if (step === 4) {
      // Either address must be provided or both GIS coordinates
      if (!address && (!longitude || !latitude)) {
        valid = false;
        stepErrors.address = 'Please provide either an address or GIS location (longitude and latitude)';
      }
    }

    setErrors(stepErrors);
    return valid;
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    } else {
      Alert.alert('Please fix the errors before continuing.');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleRegisterPatient = async () => {
    // Run full form validation if needed
    if (validateStep()) {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const response = await fetch(`${API_BASE_URL}/patients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            dob,
            gender,
            contact_number: contactNumber,
            relative_name: relativeName,
            relative_phone_number: relativePhoneNumber,
            email,
            address,
            longitude,
            latitude,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert('Patient registered successfully');
        } else {
          console.error('Error registering patient:', data.message);
          Alert.alert('Error', data.message || 'Something went wrong while registering the patient.');
        }
      } catch (error) {
        console.error('Network Error:', error);
        Alert.alert('Error', 'Failed to register patient. Please try again later.');
      }
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate.toISOString().split('T')[0]);
    }
  };

  // Render step-specific form
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <AppTextInput
              style={[styles.input, errors.firstName && styles.errorInput]}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

            <AppTextInput
              style={[styles.input, errors.lastName && styles.errorInput]}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

            <Button title="Select Date of Birth" onPress={() => setShowDatePicker(true)} />
            {dob ? <Text>Selected Date: {dob}</Text> : <Text style={styles.errorText}>{errors.dob}</Text>}
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={[styles.input, errors.gender && styles.errorInput]}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </>
        );
      case 2:
        return (
          <>
            <AppTextInput
              style={[styles.input, errors.contactNumber && styles.errorInput]}
              placeholder="Contact Number"
              value={contactNumber}
              onChangeText={setContactNumber}
            />
            {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

            <AppTextInput
              style={[styles.input, errors.email && styles.errorInput]}
              placeholder="Email (Optional)"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </>
        );
      case 3:
        return (
          <>
            <AppTextInput
              style={[styles.input, errors.relativeName && styles.errorInput]}
              placeholder="Relative's Name"
              value={relativeName}
              onChangeText={setRelativeName}
            />
            {errors.relativeName && <Text style={styles.errorText}>{errors.relativeName}</Text>}

            <AppTextInput
              style={[styles.input, errors.relativePhoneNumber && styles.errorInput]}
              placeholder="Relative's Phone Number"
              value={relativePhoneNumber}
              onChangeText={setRelativePhoneNumber}
            />
          </>
        );
      case 4:
        return (
          <>
            <AppTextInput
              style={[styles.input, errors.address && styles.errorInput]}
              placeholder="Address (Optional)"
              value={address}
              onChangeText={setAddress}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

            {!address && (
              <>
                <AppTextInput
                  style={[styles.input, errors.longitude && styles.errorInput]}
                  placeholder="Longitude (GIS Location)"
                  value={longitude}
                  onChangeText={setLongitude}
                />
                <AppTextInput
                  style={[styles.input, errors.latitude && styles.errorInput]}
                  placeholder="Latitude (GIS Location)"
                  value={latitude}
                  onChangeText={setLatitude}
                />
              </>
            )}
          </>
        );
      case 5:
        return (
          <View>
            <Text style={styles.reviewTitle}>Review your details:</Text>
            <Text>First Name: {firstName}</Text>
            <Text>Last Name: {lastName}</Text>
            <Text>Date of Birth: {dob}</Text>
            <Text>Gender: {gender}</Text>
            <Text>Contact Number: {contactNumber}</Text>
            <Text>Email: {email}</Text>
            <Text>Relative's Name: {relativeName}</Text>
            <Text>Relative's Phone: {relativePhoneNumber}</Text>
            <Text>Address: {address || 'N/A'}</Text>
            { !address && (
              <>
                <Text>Longitude: {longitude}</Text>
                <Text>Latitude: {latitude}</Text>
              </>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
  <LinearGradient
  colors={['#1b0d2e', '#2b1550', '#3e207a']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ flex: 1 }}
>

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Register New Patient</Text>
        {renderStep()}

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <Button title="Back" onPress={handleBack} />
          )}
          {step < totalSteps && (
            <TouchableOpacity
            style={styles.orangeButton}
            onPress={step === totalSteps ? handleRegisterPatient : handleNext}
          >
            <Text style={styles.buttonText}>
              {step === totalSteps ? 'Register Patient' : 'Next'}
            </Text>
          </TouchableOpacity>
          
          )}
          {step === totalSteps && (
            <Button title="Register Patient" onPress={handleRegisterPatient} />
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} />
        </View>
      </View>
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#2f2542',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#3a2f54',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  input: {
    width: '100%',
    minHeight: 50,
    borderWidth: 1.2,
    borderColor: '#a81ee6',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    color: '#ffffff',
    backgroundColor: 'transparent',
  
    // Shadow (iOS)
    shadowColor: '#a81ee6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  
    // Shadow (Android)
    elevation: 4, // Won’t look exactly the same but adds depth
  },
  
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },  
  progressBar: {
    height: 8,
    backgroundColor: '#fe7c3f',
    borderRadius: 4,
  },  
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orangeButton: {
    backgroundColor: '#fe7c3f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },  
});
