import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import AppTextInput from '@/components/AppTextInput';

export default function RegisterAccountScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      return Alert.alert('Error', 'Please fill out all fields.');
    }

    if (!email.toLowerCase().endsWith('@acc.com')) {
      return Alert.alert('Error', 'Email must be an @acc.com address.');
    }

    const token = await SecureStore.getItemAsync('userToken');
    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'User registered successfully');
        router.back();
      } else {
        Alert.alert('Error', data.message || 'Failed to register user');
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Error', 'Server error');
    }
  };

  return (
    <LinearGradient colors={['#1b0d2e', '#2b1550', '#3e207a']} style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace(`/(tabs)/settings`)} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient colors={['#240046', '#5a189a', '#9d4edd']} style={styles.card}>
          <Text style={styles.title}>Register New Account</Text>

          <AppTextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.darkPurpleInput}/>
          <AppTextInput
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.darkPurpleInput}
          />
          <AppTextInput
            placeholder="Password"
            secureTextEntry = {false}
            value={password}
            onChangeText={setPassword}
            style={styles.darkPurpleInput}
          />

<Text style={styles.roleLabel}>Select Role</Text>
<View style={styles.roleSwitcher}>
  <TouchableOpacity
    style={[styles.roleButton, role === 'admin' && styles.roleButtonSelected]}
    onPress={() => setRole('admin')}
  >
    <Ionicons name="shield-checkmark" size={24} color={role === 'admin' ? '#fff' : '#999'} />
    <Text style={[styles.roleText, role === 'admin' && styles.roleTextSelected]}>Admin</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.roleButton, role === 'doctor' && styles.roleButtonSelected]}
    onPress={() => setRole('doctor')}
  >
    <Ionicons name="medkit" size={24} color={role === 'doctor' ? '#fff' : '#999'} />
    <Text style={[styles.roleText, role === 'doctor' && styles.roleTextSelected]}>Doctor</Text>
  </TouchableOpacity>
</View>


          <TouchableOpacity style={styles.orangeButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    paddingTop: 50,
    backgroundColor: '#241b35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 30,
    alignItems: 'center',
    paddingBottom: 40,
  },
  formCard: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#2f2542',
    borderRadius: 10,
    padding: 20,
    borderColor: '#3a2f54',
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ED834F',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1.2,
    borderColor: '#a81ee6',
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 12,
    height: 60,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 40,
    color: '#000',
  },
  pickerIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -10,
  },
  orangeButton: {
    backgroundColor: '#fe7c3f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  label: {
    color: '#aaa',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  
  roleSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#3a2f54',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2f2542',
  },
  
  roleButtonSelected: {
    backgroundColor: '#a81ee6',
  },
  
  roleText: {
    color: '#999',
    fontWeight: '600',
  },
  
  roleTextSelected: {
    color: '#fff',
  },
  roleLabel: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
    marginTop: 24,
    alignSelf: 'center',
    textAlign: 'center',
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
