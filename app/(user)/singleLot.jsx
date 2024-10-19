import React, { useState, useEffect } from 'react';
import { View,StyleSheet, Text,Platform,Linking, ScrollView, Image, Pressable, TextInput, Modal, Switch, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker,Callout } from 'react-native-maps';
import { LineChart } from 'react-native-chart-kit';

const ParkingLotDetailsScreen = () => {
  const [parkingLotData, setParkingLotData] = useState(null);
  const [availableSpots, setAvailableSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { id } = useLocalSearchParams();

  useEffect(() => {
    fetchParkingLotDetails();
  }, []);

  const handleNavigation = async (lot) => {
    const lat = lot.location.coordinates[1]
    const long = lot.location.coordinates[0]
    const destination = `${lat},${long}`
    const label = encodeURIComponent(lot.name)

    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' })
    const url = Platform.select({
      ios: `${scheme}q=${label}&ll=${destination}&z=16`,
      android: `${scheme}${destination}?q=${label}`
    })

    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert(
        "Navigation Error",
        "Unable to open maps application. Please make sure you have a maps app installed.",
        [{ text: "OK" }]
      )
    }
  }

  const fetchParkingLotDetails = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/api/parkinglot/${id}`);
      if (!response.ok) {
        throw new Error("Cannot fetch details");
      }
      const data = await response.json();
      setParkingLotData(data.parkingLot);
      setAvailableSpots(data.availableSpots);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch parking lot details. Please try again later.');
      setLoading(false);
    }
  };

  const handleSpotPress = (spot) => {
    if (spot.available) {
      setSelectedSpot(spot);
      setIsBookingModalVisible(true);
    }
  };

  const handleBooking = (spotId, duration) => {
    console.log(`Booked spot ${spotId} for ${duration} hours`);
    // Here you would typically update the spot's availability and process the payment
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically update the favorite status in your backend
  };

  const formatLocation = (location) => {
    if (typeof location === 'object' && location.type === 'Point' && Array.isArray(location.coordinates)) {
      return `${location.coordinates[1].toFixed(6)}, ${location.coordinates[0].toFixed(6)}`;
    }
    return 'Location not available';
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-lg text-gray-600">Loading parking lot details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <Text className="text-red-500 text-lg text-center mb-4">{error}</Text>
        <Pressable 
          className="bg-blue-500 px-6 py-3 rounded-full shadow-md active:bg-blue-600"
          onPress={fetchParkingLotDetails}
        >
          <Text className="text-white font-bold text-lg">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="bg-gray-100">
      <View className="bg-white shadow-md rounded-b-3xl overflow-hidden">
        <Image 
          source={{ uri: parkingLotData.img }} 
          className="w-full h-64 object-cover"
          alt='Parking lot image'
        />
        <View className="p-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-3xl font-bold text-gray-800">{parkingLotData.name}</Text>
            <Pressable onPress={toggleFavorite}>
              <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={24} color={isFavorite ? "red" : "gray"} />
            </Pressable>
          </View>
          <View className="flex-row items-center mb-4">
            <Entypo name="location-pin" size={24} color="#3b82f6" />
            <Text className="text-gray-600 ml-2">{formatLocation(parkingLotData.location)}</Text>
          </View>
          <View className="flex-row items-center justify-between bg-blue-100 p-4 rounded-lg mb-6">
            <View className="flex-row items-center">
              <FontAwesome name="car" size={24} color="#3b82f6" />
              <Text className="text-lg font-semibold text-blue-600 ml-2">
                Available Spots
              </Text>
            </View>
            <Text className="text-2xl font-bold text-blue-600">
              {parkingLotData.availableSpots}
            </Text>
          </View>
          
          <Text className="text-xl font-semibold text-gray-800 mb-4">Location</Text>
          <MapView
            className="w-full h-40 mb-6 rounded-lg"
            initialRegion={{
              latitude: parkingLotData.location.coordinates[1],
              longitude: parkingLotData.location.coordinates[0],
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: parkingLotData.location.coordinates[1],
                longitude: parkingLotData.location.coordinates[0],
              }}
              title={parkingLotData.name}
            >
<Callout tooltip>
                <View style={styles.calloutContainer} className="bg-white p-4 rounded-2xl">
                  <Text style={styles.calloutTitle} className="text-lg">{parkingLotData.name}</Text>
                  <Text className="text-lg">Available Spots: {parkingLotData.availableSpots}</Text>
                  <Pressable
                  className="bg-blue-400 flex-row py-2 gap-2 mt-1 items-center"
                    style={styles.navigateButton}
                    onPress={() => handleNavigation(parkingLotData)}
                  >
                    <Feather name="navigation" size={20} color="white" />
                    <Text className="text-xl font-semibold text-white" style={styles.navigateButtonText}>Navigate</Text>
                  </Pressable>
                </View>
              </Callout>
              </Marker>
          </MapView>

          {/* <Text className="text-xl font-semibold text-gray-800 mb-4">Amenities</Text>
          <View className="flex-row flex-wrap mb-6">
            {parkingLotData.amenities.map((amenity, index) => (
              <View key={index} className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-gray-700">{amenity}</Text>
              </View>
            ))}
          </View> */}

          <Text className="text-xl font-semibold text-gray-800 mb-4">Occupancy</Text>
          <LineChart
            data={{
              labels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm"],
              datasets: [
                {
                  data: [20, 45, 28, 80, 99, 43]
                }
              ]
            }}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />

          <Text className="text-xl font-semibold text-gray-800 mb-4 mt-6">
            Select a Parking Spot
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {availableSpots?.map((spot) => (
              <Pressable
                key={spot._id}
                className={`w-[22%] h-20 mb-4 rounded-lg items-center justify-center shadow-sm ${
                  spot.available ? 'bg-green-500 active:bg-green-600' : 'bg-red-500'
                }`}
                onPress={() => handleSpotPress(spot)}
                disabled={!spot.available}
                accessibilityLabel={`Parking spot ${spot.id}, ${spot.available ? 'available' : 'occupied'}`}
              >
                {spot.type === "four" ? (
                  <FontAwesome name="car" size={32} color="white" />
                ) : (
                  <MaterialCommunityIcons name="motorbike" size={32} color="white" />
                )}
                <Text className="text-white font-bold mt-2">{spot.id}</Text>
              </Pressable>
            ))}
          </View>
          <View className="mt-6 p-4 bg-gray-100 rounded-lg">
            <Text className="text-sm text-gray-600 text-center">
              <Feather name="info" size={16} color="#4b5563" className="mr-2" />
              Green spots are available. Tap on a green spot to book.
            </Text>
          </View>
        </View>
      </View>
      {selectedSpot && (
        <BookingModal
          spot={selectedSpot}
          isVisible={isBookingModalVisible}
          onClose={() => setIsBookingModalVisible(false)}
          onBook={handleBooking}
        />
      )}
    </ScrollView>
  );
};

const BookingModal = ({ spot, isVisible, onClose, onBook }) => {
  const [duration, setDuration] = useState('1');
  const [isAdvanceBooking, setIsAdvanceBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBook = () => {
    onBook(spot.id, parseInt(duration, 10), isAdvanceBooking ? bookingDate : null);
    onClose();
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || bookingDate;
    setShowDatePicker(false);
    setBookingDate(currentDate);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-3xl p-6 shadow-lg">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-3xl font-bold text-gray-800">Book Spot {spot.id}</Text>
            <Pressable onPress={onClose} className="p-2">
              <Feather name="x" size={24} color="#4b5563" />
            </Pressable>
          </View>
          <View className="mb-6 bg-gray-100 p-4 rounded-lg">
            <Text className="text-xl font-semibold text-gray-800 mb-2">Spot Details</Text>
            <View className="flex-row items-center mb-2">
              <FontAwesome name={spot.type === 'four' ? 'car' : 'motorcycle'} size={20} color="#3b82f6" />
              <Text className="text-gray-600 ml-2">Type: {spot.type === 'four' ? 'Car' : 'Motorbike'}</Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome name="dollar" size={20} color="#3b82f6" />
              <Text className="text-gray-600 ml-2">Price per hour: $3</Text>
            </View>
          </View>
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-2">Duration (hours)</Text>
            <View className="flex-row items-center bg-gray-100 rounded-lg p-2">
              <Feather name="clock" size={24} color="#3b82f6" />
              <TextInput
                className="flex-1 text-lg text-gray-800 ml-2"
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
                placeholder="Enter duration"
              />
            </View>
          </View>
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-semibold text-gray-800">Advance Booking</Text>
            <Switch
              value={isAdvanceBooking}
              onValueChange={setIsAdvanceBooking}
              trackColor={{ false: "#767577", true: "#3b82f6" }}
              thumbColor={isAdvanceBooking ? "#ffffff" : "#f4f3f4"}
            />
          </View>
          {isAdvanceBooking && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-gray-800 mb-2">Booking Date and Time</Text>
              <Pressable
                className="flex-row items-center bg-gray-100 rounded-lg p-4"
                onPress={() => setShowDatePicker(true)}
              >
                <AntDesign name="calendar" size={24} color="#3b82f6" />
                <Text className="text-lg text-gray-800 ml-2">
                  {bookingDate.toLocaleString()}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={bookingDate}
                  mode="datetime"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
          )}
          <View className="mb-6 bg-blue-100 p-4 rounded-lg">
            <Text className="text-xl font-semibold text-blue-800 mb-2">Total Price</Text>
            <Text className="text-3xl font-bold text-blue-600">${3 * parseInt(duration, 10)}</Text>
          </View>
          <Pressable
            className="bg-blue-500 p-4 rounded-lg flex-row justify-center items-center shadow-md active:bg-blue-600"
            onPress={handleBook}
          >
            <Entypo name="credit-card" size={24} color="white" />
            <Text className="text-white font-bold text-xl ml-2">Pay and Book</Text>
          </Pressable>
          <Text className="text-sm text-gray-500 mt-4 text-center">
            By booking, you agree to our terms and conditions.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ParkingLotDetailsScreen;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});