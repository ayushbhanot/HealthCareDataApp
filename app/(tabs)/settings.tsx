import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#240046', '#5a189a', '#9d4edd']} style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Settings Icon */}
        <Ionicons name="settings" size={64} color="#ED834F" style={styles.icon} />

        {/* Heading */}
        <Text style={styles.title}>Admin Settings</Text>
        <Text style={styles.subtitle}>Configure your account and user access</Text>

        {/* Register Account Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/admin/registerUser')}
        >
          <Text style={styles.buttonText}>Register Account</Text>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => router.replace('/admin/delete')}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ED834F',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#ED834F',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 16,
    width: 250,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
