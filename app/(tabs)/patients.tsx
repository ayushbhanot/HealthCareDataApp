// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Image,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import * as SecureStore from 'expo-secure-store';
// import { API_BASE_URL } from '@/constants/env';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useFocusEffect } from '@react-navigation/native';


// // Define the Patient type with an optional imageUrl field
// type Patient = {
//   id: string;
//   first_name: string;
//   last_name: string;
//   dob: string;
//   gender: string;
//   id_image_url?: string;
//   // Add additional fields as needed
// };

// // Import your default image asset
// const defaultImage = require('../../assets/images/defaultProfile.png');

// const PatientCard = ({ patient }: { patient: Patient }) => {
//   const router = useRouter();

//   return (
//     <TouchableOpacity
//       style={styles.itemContainer}
//       onPress={() => router.push(`/questionnaire?id=${patient.id}`)}
//     >
//       <Image
//   source={patient.id_image_url ? { uri: `${API_BASE_URL}${patient.id_image_url}` } : defaultImage}
//   style={styles.profileImage}
//   resizeMode="cover"
// />

//       <View style={styles.detailsContainer}>
//         <Text style={styles.itemText}>
//           {patient.first_name} {patient.last_name}
//         </Text>
//         <Text style={styles.idText}>ID: {patient.id}</Text>
//         <View style={styles.infoRow}>
//           <Text style={styles.itemSubText}>DOB: {patient.dob}</Text>
//           <Text style={styles.itemSubText}>Gender: {patient.gender}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default function PatientsScreen() {
//   const router = useRouter();
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

  

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const token = await SecureStore.getItemAsync("userToken");
//         const response = await fetch(`${API_BASE_URL}/patients`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to fetch patients');
//         }
//         const data = await response.json();
//         setPatients(data.patients);
//         console.log('Fetched patients:', data.patients);
//       } catch (error: any) {
//         console.error('Error fetching patients:', error);
//         setError(error.message);
//         Alert.alert('Error', error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatients();
//   }, []);

//   const renderItem = ({ item }: { item: Patient }) => (
//     <PatientCard patient={item} />
//   );




//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <LinearGradient
//       colors={['#1b0d2e', '#2b1550', '#3e207a']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.linearGradient}
//     >
//       <View style={styles.overlay}>
//         <Text style={styles.title}>Select a Patient</Text>
//         <FlatList
//           data={patients}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           showsVerticalScrollIndicator={true}
//           // On iOS, this makes the scroll indicator white
//           indicatorStyle="white"
//           contentContainerStyle={styles.listContainer}
//         />
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   linearGradient: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     paddingTop: 30, // Fixed top padding; adjust as needed
//     paddingHorizontal: 0, // Reduced to allow cards to use more width
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#2f2542',
//     marginHorizontal: 10, // Controls spacing from the gradient edges
//     marginBottom: 12,
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1.2,
//     borderColor: '#a81ee6',
//     shadowColor: '#a81ee6',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   profileImage: {
//     width: 100,
//     height: 60,
//     borderRadius: 8, // For a square look, you can set this to 0 if desired
//     marginRight: 16,
//     borderWidth: 2,
//     borderColor: '#fe7c3f',
//   },
//   detailsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   itemText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#ffffff',
//     marginBottom: 4,
//   },
//   idText: {
//     fontSize: 14,
//     color: '#cccccc',
//     marginBottom: 4,
//     // This line ensures it uses full available width
//     width: '100%',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   itemSubText: {
//     fontSize: 14,
//     color: '#cccccc',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1b0d2e',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1b0d2e',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
// });


import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

// Define the Patient type with an optional id_image_url field
type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  id_image_url?: string;
  address?: string;
};

// Import your default image asset
const defaultImage = require('../../assets/images/defaultProfile.png');

const PatientCard = ({ patient }: { patient: Patient }) => {
  const router = useRouter();

  const formattedDob = new Date(patient.dob).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <TouchableOpacity style={styles.card}>
  <Image
    source={patient.id_image_url ? { uri: `${API_BASE_URL}${patient.id_image_url}` } : defaultImage}
    style={styles.avatar}
  />
  <View style={styles.info}>
    <Text style={styles.name}>{patient.first_name} {patient.last_name}</Text>
    <View style={styles.row}>
      <Text style={styles.subText}>DOB: {formattedDob}</Text>
      <Text style={styles.subText}>⚥: {patient.gender}</Text>
    </View>
    {!!patient.address && (
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subText}>
        Address: {patient.address}
      </Text>
    )}
  </View>
</TouchableOpacity>

  );
};


export default function PatientsScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define fetchPatients at the top level using useCallback
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(`${API_BASE_URL}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch patients');
      }
      const data = await response.json();
      setPatients(data.patients);
      console.log('Fetched patients:', data.patients);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      setError(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use useFocusEffect to refetch patients every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients])
  );

  const renderItem = ({ item }: { item: Patient }) => (
    <PatientCard patient={item} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1b0d2e', '#2b1550', '#3e207a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.linearGradient}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Select a Patient</Text>
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={true}
          indicatorStyle="white" // iOS scroll indicator color
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: 30, // Adjust as needed
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#2f2542',
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#a81ee6',
    shadowColor: '#a81ee6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  profileImage: {
    width: 100,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#fe7c3f',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  idText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 4,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemSubText: {
    fontSize: 14,
    color: '#cccccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b0d2e',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b0d2e',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#2f2542',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    borderColor: '#a81ee6',
    borderWidth: 1.2,
    shadowColor: '#a81ee6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fe7c3f',
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  subText: {
    fontSize: 13,
    color: '#ccc',
  },
  
});
