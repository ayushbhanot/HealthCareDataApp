import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    terms: false,
    privacy: false,
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    if (!formData.terms || !formData.privacy) {
      Alert.alert('Error', 'Please accept the terms and conditions and privacy policy.');
      return;
    }
    Alert.alert('Success', 'Form submitted successfully!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          onChangeText={(value) => handleChange('firstName', value)}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Last Name"
          onChangeText={(value) => handleChange('lastName', value)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(value) => handleChange('email', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(value) => handleChange('password', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        onChangeText={(value) => handleChange('phone', value)}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Age"
          keyboardType="numeric"
          onChangeText={(value) => handleChange('age', value)}
        />
        <View style={[styles.pickerContainer, styles.halfInput]}>
          <Picker
            selectedValue={formData.gender}
            style={styles.picker}
            onValueChange={(value) => handleChange('gender', value)}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
            <Picker.Item label="Prefer not to say" value="preferNotToSay" />
          </Picker>
        </View>
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Height (cm)"
          keyboardType="numeric"
          onChangeText={(value) => handleChange('height', value)}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          onChangeText={(value) => handleChange('weight', value)}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.bloodType}
          style={styles.picker}
          onValueChange={(value) => handleChange('bloodType', value)}
        >
          <Picker.Item label="Select Blood Type" value="" />
          <Picker.Item label="A+" value="A+" />
          <Picker.Item label="A-" value="A-" />
          <Picker.Item label="B+" value="B+" />
          <Picker.Item label="B-" value="B-" />
          <Picker.Item label="AB+" value="AB+" />
          <Picker.Item label="AB-" value="AB-" />
          <Picker.Item label="O+" value="O+" />
          <Picker.Item label="O-" value="O-" />
        </Picker>
      </View>

      <View style={styles.row}>
        <Switch
          value={formData.terms}
          onValueChange={(value) => handleChange('terms', value)}
        />
        <Text style={styles.checkboxLabel}>I agree to the terms and conditions</Text>
      </View>
      <View style={styles.row}>
        <Switch
          value={formData.privacy}
          onValueChange={(value) => handleChange('privacy', value)}
        />
        <Text style={styles.checkboxLabel}>I consent to the data privacy policy</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
});
