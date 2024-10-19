'use client'

import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

export default function AddNewParkingLotScreen() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [totalSpots, setTotalSpots] = useState('')
  const [availableSpots, setAvailableSpots] = useState('')
  const [levels, setLevels] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = async () => {
    if (!name || !totalSpots || !availableSpots || !levels || !location) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    const newLot = {
      name,
      totalSpots: parseInt(totalSpots),
      availableSpots: parseInt(availableSpots),
      levels: parseInt(levels),
      location,
    }

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll just simulate a successful creation
      console.log('Creating new parking lot:', newLot)
      Alert.alert('Success', 'Parking lot created successfully')
      router.back() // Navigate back to the previous screen
    } catch (error) {
      console.error('Error creating parking lot:', error)
      Alert.alert('Error', 'Failed to create parking lot. Please try again.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add New Parking Lot</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Parking Lot Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter parking lot name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Total Spots</Text>
          <TextInput
            style={styles.input}
            value={totalSpots}
            onChangeText={setTotalSpots}
            placeholder="Enter total number of spots"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Available Spots</Text>
          <TextInput
            style={styles.input}
            value={availableSpots}
            onChangeText={setAvailableSpots}
            placeholder="Enter number of available spots"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Number of Levels</Text>
          <TextInput
            style={styles.input}
            value={levels}
            onChangeText={setLevels}
            placeholder="Enter number of levels"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter parking lot location"
          />
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Parking Lot</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
})