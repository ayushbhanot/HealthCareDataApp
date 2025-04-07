import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/env';

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

    return (
        <ScrollView style={styles.container}>
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
                <Text style={{ color: '#fff', marginTop: 20 }}>No symptoms found.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#1b0d2e',
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fe7c3f',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
    },
    resultsContainer: {
        marginTop: 20,
    },
    resultsTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    symptomItem: {
        padding: 12,
        backgroundColor: '#3e2f5a',
        marginBottom: 8,
        borderRadius: 8,
    },
    symptomText: {
        color: '#fff',
        fontSize: 16,
    },
});
