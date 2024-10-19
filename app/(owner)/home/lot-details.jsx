'use client'

import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Pressable, TextInput, Modal, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Edit2, Trash2, Plus, Car, User, ChevronDown } from 'lucide-react-native'
import { Picker } from '@react-native-picker/picker'

export default function ParkingLotDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [parkingLot, setParkingLot] = useState(null)
  const [isAddingSpot, setIsAddingSpot] = useState(false)
  const [newSpotNumber, setNewSpotNumber] = useState('')
  const [editingSpot, setEditingSpot] = useState(null)
  const [filter, setFilter] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const fetchParkingLot = async () => {
      // Simulating API call
      const mockLot = {
        id: id,
        name: 'Jalukbari Junction Parking ',
        type: 'commercial',
        totalSpots: 70,
        availableSpots: 15,
        levels: 2,
        location: 'Jalukbari, Guwahati',
        spots: Array.from({ length: 70 }, (_, i) => ({
          id: `spot-${i + 1}`,
          number: `${i + 1}`,
          isAvailable: Math.random() > 0.5,
          vehicleNumber: Math.random() > 0.7 ? `ABC${1000 + i}` : undefined,
          bookingEndTime: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 86400000).toISOString() : undefined
        }))
      }
      setParkingLot(mockLot)
    }

    fetchParkingLot()
  }, [id])

  const handleAddSpot = () => {
    if (!newSpotNumber.trim() || !parkingLot) {
      Alert.alert('Error', 'Please enter a valid spot number')
      return
    }

    setParkingLot(prevLot => {
      if (!prevLot) return null
      return {
        ...prevLot,
        totalSpots: prevLot.totalSpots + 1,
        availableSpots: prevLot.availableSpots + 1,
        spots: [
          ...prevLot.spots,
          { id: `spot-${prevLot.spots.length + 1}`, number: newSpotNumber, isAvailable: true }
        ]
      }
    })

    setNewSpotNumber('')
    setIsAddingSpot(false)
    Alert.alert('Success', 'New spot added successfully')
  }

  const handleDeleteSpot = (spotId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this spot?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setParkingLot(prevLot => {
              if (!prevLot) return null
              const updatedSpots = prevLot.spots.filter(spot => spot.id !== spotId)
              return {
                ...prevLot,
                totalSpots: prevLot.totalSpots - 1,
                availableSpots: prevLot.availableSpots - (prevLot.spots.find(spot => spot.id === spotId)?.isAvailable ? 1 : 0),
                spots: updatedSpots
              }
            })
            Alert.alert('Success', 'Spot deleted successfully')
          }
        }
      ]
    )
  }

  const toggleSpotAvailability = (spotId) => {
    setParkingLot(prevLot => {
      if (!prevLot) return null
      const updatedSpots = prevLot.spots.map(spot => 
        spot.id === spotId ? { ...spot, isAvailable: !spot.isAvailable } : spot
      )
      const availableCount = updatedSpots.filter(spot => spot.isAvailable).length
      return {
        ...prevLot,
        availableSpots: availableCount,
        spots: updatedSpots
      }
    })
  }

  const handleEditSpot = (spot) => {
    setEditingSpot(spot)
  }

  const handleUpdateSpot = () => {
    if (!editingSpot || !parkingLot) return

    setParkingLot(prevLot => {
      if (!prevLot) return null
      const updatedSpots = prevLot.spots.map(spot => 
        spot.id === editingSpot.id ? editingSpot : spot
      )
      return {
        ...prevLot,
        spots: updatedSpots
      }
    })

    setEditingSpot(null)
    Alert.alert('Success', 'Spot updated successfully')
  }

  const filteredSpots = parkingLot?.spots.filter(spot => {
    if (filter === 'available') return spot.isAvailable
    if (filter === 'occupied') return !spot.isAvailable
    return true
  })

  if (!parkingLot) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-center text-lg">Loading...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold text-blue-600 mb-4">{parkingLot.name}</Text>
        <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <Text className="text-base text-gray-700 mb-2">Total Spots: {parkingLot.totalSpots}</Text>
          <Text className="text-base text-gray-700 mb-2">Available Spots: {parkingLot.availableSpots}</Text>
          <Text className="text-base text-gray-700 mb-2">Levels: {parkingLot.levels}</Text>
          <Text className="text-base text-gray-700">Location: {parkingLot.location}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Pressable 
            className="bg-blue-600 rounded-lg p-4 flex-1 mr-2" 
            onPress={() => setIsAddingSpot(true)}
          >
            <Text className="text-white font-bold text-base text-center">Add New Spot</Text>
          </Pressable>
          <Pressable
            className="bg-gray-200 rounded-lg p-4 flex-1 ml-2 flex-row justify-between items-center"
            onPress={() => setIsFilterOpen(true)}
          >
            <Text className="text-gray-700 font-semibold">
              {filter === 'all' ? 'All Spots' : filter === 'available' ? 'Available' : 'Occupied'}
            </Text>
            <ChevronDown color="#4B5563" size={20} />
          </Pressable>
        </View>

        <Text className="text-xl font-bold text-gray-800 mb-4">Parking Spots</Text>
        <View>
          {filteredSpots.map(spot => (
            <View key={spot.id} className="bg-gray-100 rounded-lg p-4 mb-3 flex-row justify-between items-center">
              <View>
                <Text className="text-base font-semibold text-gray-800">Spot {spot.number}</Text>
                {parkingLot.type === 'residential' && (
                  <Text className="text-sm text-gray-600">
                    {spot.assignedTo ? `Assigned to: ${spot.assignedTo}` : 'Unassigned'}
                  </Text>
                )}
                {parkingLot.type === 'commercial' && spot.vehicleNumber && (
                  <Text className="text-sm text-gray-600">Vehicle: {spot.vehicleNumber}</Text>
                )}
                {parkingLot.type === 'commercial' && spot.bookingEndTime && (
                  <Text className="text-sm text-gray-600">
                    Booked until: {new Date(spot.bookingEndTime).toLocaleTimeString()}
                  </Text>
                )}
              </View>
              <View className="flex-row">
                <Pressable
                  className={`p-2 rounded-lg mr-2 ${spot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                  onPress={() => toggleSpotAvailability(spot.id)}
                >
                  <Text className="text-white font-semibold">
                    {spot.isAvailable ? 'Available' : 'Occupied'}
                  </Text>
                </Pressable>
                <Pressable
                  className="bg-yellow-500 p-2 rounded-lg mr-2"
                  onPress={() => handleEditSpot(spot)}
                >
                  <Edit2 color="white" size={20} />
                </Pressable>
                <Pressable
                  className="bg-gray-500 p-2 rounded-lg"
                  onPress={() => handleDeleteSpot(spot.id)}
                >
                  <Trash2 color="white" size={20} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={isAddingSpot} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-4/5">
            <Text className="text-xl font-bold text-blue-600 mb-4">Add New Spot</Text>
            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-base mb-4"
              value={newSpotNumber}
              onChangeText={setNewSpotNumber}
              placeholder="Enter spot number"
              keyboardType="numeric"
            />
            <View className="flex-row justify-between">
              <Pressable 
                className="bg-gray-500 rounded-lg p-3 flex-1 mr-2" 
                onPress={() => setIsAddingSpot(false)}
              >
                <Text className="text-white font-bold text-center">Cancel</Text>
              </Pressable>
              <Pressable 
                className="bg-blue-600 rounded-lg p-3 flex-1 ml-2" 
                onPress={handleAddSpot}
              >
                <Text className="text-white font-bold text-center">Add Spot</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!editingSpot} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-4/5">
            <Text className="text-xl font-bold text-blue-600 mb-4">Edit Spot</Text>
            {editingSpot && (
              <>
                <TextInput
                  className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-base mb-4"
                  value={editingSpot.number}
                  onChangeText={(text) => setEditingSpot({...editingSpot, number: text})}
                  placeholder="Spot number"
                />
                {parkingLot.type === 'residential' && (
                  <TextInput
                    className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-base mb-4"
                    value={editingSpot.assignedTo}
                    onChangeText={(text) => setEditingSpot({...editingSpot, assignedTo: text})}
                    placeholder="Assigned to"
                  />
                )}
                {parkingLot.type === 'commercial' && (
                  <>
                    <TextInput
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-base mb-4"
                      value={editingSpot.vehicleNumber}
                      onChangeText={(text) => setEditingSpot({...editingSpot, vehicleNumber: text})}
                      placeholder="Vehicle number"
                    />
                    <TextInput
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-base mb-4"
                      value={editingSpot.bookingEndTime}
                      onChangeText={(text) => setEditingSpot({...editingSpot, bookingEndTime: text})}
                      placeholder="Booking end time"
                    />
                  </>
                )}
                <View className="flex-row justify-between">
                  <Pressable 
                    className="bg-gray-500 rounded-lg p-3 flex-1 mr-2" 
                    onPress={() => setEditingSpot(null)}
                  >
                    <Text className="text-white font-bold text-center">Cancel</Text>
                  </Pressable>
                  <Pressable 
                    className="bg-blue-600 rounded-lg p-3 flex-1 ml-2" 
                    onPress={handleUpdateSpot}
                  >
                    <Text className="text-white font-bold text-center">Update</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={isFilterOpen} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-lg p-6">
            <Text className="text-xl font-bold text-blue-600 mb-4">Filter Spots</Text>
            <Picker
              selectedValue={filter}
              onValueChange={(itemValue) => {
                setFilter(itemValue)
                setIsFilterOpen(false)
              }}
            >
              <Picker.Item label="All Spots" value="all" />
              <Picker.Item label="Available" value="available" />
              <Picker.Item label="Occupied" value="occupied" />
            </Picker>
            <Pressable 
              className="bg-gray-500 rounded-lg p-3 mt-4" 
              onPress={() => setIsFilterOpen(false)}
            >
              <Text className="text-white font-bold text-center">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}