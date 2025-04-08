import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';

export default function DeleteAccountScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      try {
        const res = await fetch(`${API_BASE_URL}/users/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
        Alert.alert('Error', 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const token = await SecureStore.getItemAsync('userToken');
          try {
            const res = await fetch(`${API_BASE_URL}/users/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            if (res.ok) {
              Alert.alert('Success', 'User deleted.');
              setUsers((prev) => prev.filter((u) => u.id !== id));
            } else {
              Alert.alert('Error', data.message || 'Failed to delete user.');
            }
          } catch (err) {
            console.error('Delete error:', err);
            Alert.alert('Error', 'Server error.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED834F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete User Accounts</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <View>
              <Text style={styles.userText}>{item.name} ({item.role})</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b0d2e',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1b0d2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#ED834F',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userRow: {
    backgroundColor: '#2f1d48',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#a81ee6',
    borderWidth: 1,
  },
  userText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#aaa',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
