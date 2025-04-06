import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
  Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import AppTextInput from '../../components/AppTextInput';
import DatePicker from '../../components/AppDatePicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import * as ImagePicker from 'expo-image-picker';
import celebrationAnimation from '../../assets/animations/celebration.json';



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
  const [idImage, setIdImage] = useState<{ uri: string } | null>(null);
  const [formStarted, setFormStarted] = useState(false);
  const formAnim = useState(new Animated.Value(0))[0];
  const formTranslateY = useState(new Animated.Value(50))[0];
  const formOpacity = useState(new Animated.Value(0))[0];
  const [showSuccess, setShowSuccess] = useState(false);



  // Wizard step (1 to 5)
  const [step, setStep] = useState(1);
  const totalSteps = 6;


const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setIdImage(result.assets[0]); // contains `uri` and more
  }
};

useEffect(() => {
  if (showSuccess) {
    console.log('🎉 Show success triggered!');
  }
}, [showSuccess]);



const takePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setIdImage(result.assets[0]);
  }
};

const handleStartForm = () => {
  setFormStarted(true);
  Animated.parallel([
    Animated.timing(formTranslateY, {
      toValue: 0,
      duration: 1000, // slower
      delay: 100,     // slight delay to feel more fluid
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(formOpacity, {
      toValue: 1,
      duration: 1500,
      delay: 100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
  ]).start();
};




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
      transitionStep(step + 1);
    } else {
      Alert.alert('Please fix the errors before continuing.');
    }
  };

  const handleBack = () => {
    if (step > 1) transitionStep(step - 1);
  };  

  // const handleRegisterPatient = async () => {
  //   // Run full form validation if needed
  //   if (validateStep()) {
  //     try {
  //       const token = await SecureStore.getItemAsync("userToken");
  //       const response = await fetch(`${API_BASE_URL}/patients`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           first_name: firstName,
  //           last_name: lastName,
  //           dob,
  //           gender,
  //           contact_number: contactNumber,
  //           relative_name: relativeName,
  //           relative_phone_number: relativePhoneNumber,
  //           email,
  //           address,
  //           longitude,
  //           latitude,
  //         }),
  //       });

  //       const data = await response.json();
  //       if (response.ok) {
  //         Alert.alert('Patient registered successfully');
  //       } else {
  //         console.error('Error registering patient:', data.message);
  //         Alert.alert('Error', data.message || 'Something went wrong while registering the patient.');
  //       }
  //     } catch (error) {
  //       console.error('Network Error:', error);
  //       Alert.alert('Error', 'Failed to register patient. Please try again later.');
  //     }
  //   }
  // };
//OLD REGISTER PATIENT
  // const handleRegisterPatient = async () => {
  //   if (validateStep()) {
  //     try {
  //       const token = await SecureStore.getItemAsync("userToken");
  
  //       const response = await fetch(`${API_BASE_URL}/patients`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           first_name: firstName,
  //           last_name: lastName,
  //           dob,
  //           gender,
  //           contact_number: contactNumber,
  //           relative_name: relativeName,
  //           relative_phone_number: relativePhoneNumber,
  //           email,
  //           address,
  //           longitude,
  //           latitude,
  //         }),
  //       });

        
  
  //       const data = await response.json();
  //       if (response.ok) {
  //         setShowSuccess(true);
  //         setTimeout(() => {
  //           animationRef.current?.play();
  //         }, 0)


  //         Animated.timing(successFadeAnim, {
  //           toValue: 1,
  //           duration: 600,
  //           easing: Easing.out(Easing.ease),
  //           useNativeDriver: true,
  //         }).start();
          
  //         // Reset after 4.5s (longer to show animation)
  //         setTimeout(() => {
  //           Animated.timing(successFadeAnim, {
  //             toValue: 0,
  //             duration: 600,
  //             easing: Easing.out(Easing.ease),
  //             useNativeDriver: true,
  //           }).start(() => {
  //             setShowSuccess(false);
  //             setFormStarted(false);
  //             setStep(1);
  //             resetFields(); // Extract resetting into its own function for clarity
  //           });
  //         }, 2500);
          
  //       } else {
  //         console.error('Error registering patient:', data.message);
  //         Alert.alert('Error', data.message || 'Something went wrong while registering the patient.');
  //       }
  //     } catch (error) {
  //       console.error('Network Error:', error);
  //       Alert.alert('Error', 'Failed to register patient. Please try again later.');
  //     }
  //   }
  // };

  const handleRegisterPatient = async () => {
  if (!validateStep()) return;

  try {
    const token = await SecureStore.getItemAsync("userToken");

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("contact_number", contactNumber);
    formData.append("relative_name", relativeName);
    formData.append("relative_phone_number", relativePhoneNumber);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);

    if (idImage) {
      formData.append("id_image", {
        uri: idImage.uri,
        name: "id_image.jpg",
        type: "image/jpeg",
      } as any);
    }

    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type' is set automatically by React Native
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Patient registered:", data.patient);
      setShowSuccess(true);
    
      // Trigger animation after state update
      setTimeout(() => {
        animationRef.current?.play();
      }, 0);
    
      Animated.timing(successFadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    
      setTimeout(() => {
        Animated.timing(successFadeAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setShowSuccess(false);
          setFormStarted(false);
          setStep(1);
          resetFields();
        });
      }, 2500);
    }
    else {
      console.error("❌ Backend error:", data.message);
      Alert.alert("Error", data.message || "Registration failed.");
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    Alert.alert("Error", "Failed to register patient.");
  }
};


  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setDob('');
    setGender('');
    setContactNumber('');
    setRelativeName('');
    setRelativePhoneNumber('');
    setEmail('');
    setAddress('');
    setLongitude('');
    setLatitude('');
    setIdImage(null);
  };
  
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate.toISOString().split('T')[0]);
    }
  };

  const [progressAnim] = useState(new Animated.Value(0)); // starts at 0
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successFadeAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<LottieView>(null);



  useEffect(() => {
    if (formStarted && !showSuccess) {
      fadeAnim.setValue(0); // reset before animating
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [formStarted, showSuccess]);
  
  
  const handleCancel = () => {
    Alert.alert(
      'Cancel Registration?',
      'Are you sure you want to cancel registering this patient? Your entered info will be lost.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setFormStarted(false);
            setShowSuccess(false);
            setStep(1);
            resetFields();
          },
        },
      ]
    );
  };
  

  // Function to handle fade transition on step change
  const transitionStep = (nextStep: number) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // After fade-out, update step and fade in
      setStep(nextStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  if (!formStarted) {
    return (
      <LinearGradient
        colors={['#1b0d2e', '#2b1550', '#3e207a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <TouchableOpacity onPress={handleStartForm} style={{ alignItems: 'center' }}>
  <Ionicons name="add-circle" size={130} color="#fe7c3f" />
  <Text style={{
    color: '#fe7c3f',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  }}>
    Register Patient
  </Text>
</TouchableOpacity>

      </LinearGradient>
    );
  }
 
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

<TouchableOpacity style={styles.orangeButton} onPress={() => setShowDatePicker(true)}>
  <Text style={styles.buttonText}>
    {dob ? `Date of Birth: ${dob}` : 'Select Date of Birth'}
  </Text>
</TouchableOpacity>
{errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

{errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

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
  display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 👈 this is key!
/>

<View style={styles.pickerContainer}>
  <Picker
    selectedValue={gender}
    onValueChange={(itemValue) => setGender(itemValue)}
    style={styles.picker}
    itemStyle={styles.pickerItem}
  >
    <Picker.Item label="Select Gender" value="" color="#999" />
    <Picker.Item label="Male" value="Male" color="#000"  />
    <Picker.Item label="Female" value="Female" color="#000"  />
  </Picker>
  <Ionicons
    name="chevron-down"
    size={20}
    color="#666"
    style={styles.pickerIcon}
  />
</View>




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
      <Text style={styles.reviewTitle}>Patient ID:</Text>

      {idImage ? (
       <View style={{ alignItems: 'center', marginBottom: 10 }}>
       <Image
         source={{ uri: idImage.uri }}
         style={{ width: 300, height: 200, borderRadius: 10 }}
       />
     </View>
     
      ) : (
        <Text style={{ color: '#ccc', marginBottom: 10 }}>No ID image selected yet</Text>
      )}

      <TouchableOpacity style={styles.orangeButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose from Library</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.orangeButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );

      case 6:
        return (
<View style={styles.reviewContainer}>
  <Text style={styles.reviewTitle}>Review your details:</Text>

  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>First Name:</Text>
    <Text style={styles.reviewValue}>{firstName}</Text>
  </View>

  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>Last Name:</Text>
    <Text style={styles.reviewValue}>{lastName}</Text>
  </View>

  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>Date of Birth:</Text>
    <Text style={styles.reviewValue}>{dob}</Text>
  </View>

  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>Gender:</Text>
    <Text style={styles.reviewValue}>{gender}</Text>
  </View>

  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>Contact Number:</Text>
    <Text style={styles.reviewValue}>{contactNumber}</Text>
  </View>

  {!!email && (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>Email:</Text>
      <Text style={styles.reviewValue}>{email}</Text>
    </View>
  )}

  {!!relativeName && (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>Relative's Name:</Text>
      <Text style={styles.reviewValue}>{relativeName}</Text>
    </View>
  )}

  {!!relativePhoneNumber && (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>Relative's Phone:</Text>
      <Text style={styles.reviewValue}>{relativePhoneNumber}</Text>
    </View>
  )}

  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>Address:</Text>
    <Text style={styles.reviewValue}>{address || 'N/A'}</Text>
  </View>

  {!address && (
    <>
      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Longitude:</Text>
        <Text style={styles.reviewValue}>{longitude}</Text>
      </View>
      <View style={styles.reviewRow}>
        <Text style={styles.reviewLabel}>Latitude:</Text>
        <Text style={styles.reviewValue}>{latitude}</Text>
      </View>
    </>
  )}
  {!!idImage && (
  <>
    <Text style={styles.reviewLabel}>Uploaded ID Image:</Text>
    <Image
      source={{ uri: idImage.uri }}
      style={styles.reviewImage}
      resizeMode="cover"
    />
  </>
)}

</View>
        );
      default:
        return null;
    }
    
  };

  if (showSuccess) {
    return (
      <LinearGradient
        colors={['#1b0d2e', '#2b1550', '#3e207a']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Animated.View
          style={{
            opacity: successFadeAnim,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
<LottieView
  ref={animationRef}
  source={celebrationAnimation}
  loop={false}
  style={{ width: 300, height: 300 }}
/>




          <Text
            style={{
              fontSize: 26,
              color: '#fe7c3f',
              fontWeight: 'bold',
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            Patient Registered!
          </Text>
        </Animated.View>
      </LinearGradient>
    );
  }
  
  
  
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
        <Animated.View
  style={{
    opacity: fadeAnim,
    transform: [{ translateY: formTranslateY }],
    width: '100%',
  }}
>


  {renderStep()}
</Animated.View>


        <View style={styles.buttonContainer}>
  {step === 1 ? (
    <TouchableOpacity style={styles.orangeButton} onPress={handleNext}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  ) : (
    <>
      <TouchableOpacity style={styles.halfButton} onPress={handleBack}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.halfButton}
        onPress={step === totalSteps ? handleRegisterPatient : handleNext}
      >
        <Text style={styles.buttonText}>
          {step === totalSteps ? 'Register Patient' : 'Next'}
        </Text>
      </TouchableOpacity>
      
    </>
  )}
</View>

        <AnimatedProgressBar currentStep={step} totalSteps={totalSteps} />
        {step !== 6 && (
  <TouchableOpacity
    style={[styles.orangeButton, { backgroundColor: '#dc2626', marginTop: 30 }]}
    onPress={handleCancel}
  >
    <Text style={styles.buttonText}>Cancel Registration</Text>
  </TouchableOpacity>
)}

      </View>
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 75,
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
    gap: 10,
  },
  halfButton: {
    backgroundColor: '#fe7c3f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
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

  
  pickerContainer: {
    borderWidth: 1.2,
    borderColor: '#a81ee6',
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 0,
    height: 70, // fixes floating
    justifyContent: 'center', // vertically centers on Android
  },
  
  picker: {
    width: '100%',
    height: 40,
    color: '#000', // Android fallback
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
  
  reviewContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#3a2f54',
    borderRadius: 10,
    marginBottom: 10,
  },
  
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#555',
    paddingBottom: 6,
  },
  
  reviewLabel: {
    color: '#ccc',
    fontWeight: '600',
  },
  
  reviewValue: {
    color: '#fff',
    maxWidth: '60%',
    textAlign: 'right',
  },
  reviewImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#888',
  },
  
  
  
    
  
  });
