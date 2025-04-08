import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


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
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace(`/(tabs)/settings`)} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      </View>
  
      <View style={styles.container}>
        <Text style={styles.title}>Delete User Accounts</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LinearGradient
              colors={['#1b0d2e', '#2b1550', '#3e207a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.initials}>
                  {item.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
          
              <View style={styles.info}>
  <Text style={styles.name}>{item.name}</Text>
  <Text style={styles.roleText}>Role: {item.role}</Text>
  <Text style={styles.subText}>{item.email}</Text>
</View>


          
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        />
      </View>
    </>
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
    fontSize: 17,
    color: '#aaa',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f2542',
    borderRadius: 14,
    padding: 14,
    //marginHorizontal: 8,
    marginBottom: 14,
    borderColor: '#a81ee6',
    borderWidth: 1.2,
    shadowColor: '#a81ee6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    maxWidth: '100%',
    alignSelf: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5a189a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fe7c3f',
  },
  initials: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },

  name: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  roleText: {
    fontSize: 13,
    color: '#a5f3fc',
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  
  subText: {
    fontSize: 13,
    color: '#fbbf24',
    flexWrap: 'wrap',
    flexShrink: 1,
    lineHeight: 17,
  },
  
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginLeft: 'auto',
  },
  
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  
  
  
});
