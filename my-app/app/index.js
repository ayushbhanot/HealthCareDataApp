import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>Username:</Text>
      <TextInput style={styles.input} placeholder="Enter username" />
      <Text style={styles.label}>Password:</Text>
      <TextInput style={styles.input} placeholder="Enter password" secureTextEntry />
      <Button
        title="Login"
        onPress={() => {
          router.push('(tabs)'); // Navigate to the tab layout
        }}
      />
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Not a member?</Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signUpButton}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  signUpContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#555',
  },
  signUpButton: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
});
