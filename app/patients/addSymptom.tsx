import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddSymptomScreen() {
    const { id: patientId } = useLocalSearchParams();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSymptoms = async (query: string) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const endpoint = query
                ? `${API_BASE_URL}/patients/search/symptoms?q=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/patients/search/topSymptoms`;

            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setSearchResults(data.symptoms);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch symptoms');
            }
        } catch (error) {
            console.error('Error fetching symptoms:', error);
            Alert.alert('Error', 'Failed to connect to the server.');
        }
    };

    useEffect(() => {
        fetchSymptoms('');
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchSymptoms(searchTerm);
        }, 300); // debounce for 300ms

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const addSymptom = async (symptomName: string) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await fetch(`${API_BASE_URL}/patients/addSymptom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ patient_id: patientId, symptom_name: symptomName }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', data.message);
                router.back();
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.error('Error adding symptom:', error);
            Alert.alert('Error', 'Could not add symptom.');
        }
    };

    // return (
    //     <>
    //       <View style={styles.header}>
    //         <TouchableOpacity onPress={() => router.replace(`/patients/${patientId}`)} style={styles.backButton}>
    //           <Ionicons name="chevron-back" size={24} color="#fff" />
    //         </TouchableOpacity>
    //         <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
    //       </View>
      
    //       <ScrollView style={styles.container}>
    //         <Text style={styles.title}>Search and Add Symptom</Text>
    //         <TextInput
    //           style={styles.input}
    //           placeholder="Search for a symptom..."
    //           placeholderTextColor="#aaa"
    //           value={searchTerm}
    //           onChangeText={setSearchTerm}
    //         />
      
    //         {searchResults.length > 0 ? (
    //           <View style={styles.resultsContainer}>
    //             <Text style={styles.resultsTitle}>Results:</Text>
    //             {searchResults.map((symptom, index) => (
    //               <TouchableOpacity
    //                 key={index}
    //                 style={styles.symptomItem}
    //                 onPress={() => addSymptom(symptom.symptom_name)}
    //               >
    //                 <Text style={styles.symptomText}>{symptom.symptom_name}</Text>
    //               </TouchableOpacity>
    //             ))}
    //           </View>
    //         ) : (
    //           <Text style={{ color: '#fff', marginTop: 20 }}>No symptoms found.</Text>
    //         )}
    //       </ScrollView>
    //     </>
    //   );
    // }      

    return (
        <LinearGradient
          colors={['#1b0d2e', '#2b1550', '#3e207a']}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace(`/patients/${patientId}`)} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
          </View>
      
          <ScrollView contentContainerStyle={styles.scroll}>
            <LinearGradient colors={['#240046', '#5a189a', '#9d4edd']} style={styles.card}>
              <Text style={styles.title}>Search and Add Symptom</Text>
              <TextInput
                style={styles.input}
                placeholder="Search for a symptom..."
                placeholderTextColor="#aaa"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
      
              {searchResults.length > 0 ? (
                <View style={styles.resultsContainer}>
                  <Text style={styles.resultsTitle}>Results:</Text>
                  {searchResults.map((symptom, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.symptomItem}
                      onPress={() => addSymptom(symptom.symptom_name)}
                    >
                      <Text style={styles.symptomText}>{symptom.symptom_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noResults}>No symptoms found.</Text>
              )}
            </LinearGradient>
          </ScrollView>
        </LinearGradient>
      );}

      
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#1b0d2e',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 90,
        width: '100%',
        paddingTop: 50,
        backgroundColor: '#241b35',
        marginBottom: 0,
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
      scroll: {
        padding: 20,
        paddingBottom: 40,
      },
      card: {
        borderRadius: 20,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        borderColor: '#a81ee6',
        borderWidth: 1,
      },
      title: {
        backgroundColor: '#fe7c3f',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 24,
        overflow: 'hidden',
      },
      input: {
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 16,
      },
      resultsContainer: {
        marginTop: 10,
      },
      resultsTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 12,
      },
      symptomItem: {
        padding: 14,
        backgroundColor: '#4b3266',
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fe7c3f',
      },
      symptomText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
      },
      noResults: {
        color: '#aaa',
        marginTop: 20,
        textAlign: 'center',
        fontSize: 15,
      },
      
});
