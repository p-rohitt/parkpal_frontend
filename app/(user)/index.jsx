import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Callout, Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import Spinner from '@/components/spinner';
import useUserStore from '@/stores/userStore';
import useLotStore from '@/stores/lotStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INITIAL_REGION = {
  latitude: 29.9511,
  longitude: -90.031533,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { location, setLocation } = useUserStore();
  const { lots, setParkingLots } = useLotStore();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLots, setFilteredLots] = useState([]);
  const [mapRegion, setMapRegion] = useState(INITIAL_REGION);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchParkingLots = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URI}/api/parkinglot/getParkingLots`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNmQxM2JkYS0yZjhmLTQ5Y2ItYjkxMy01NWQzNTY5NjEzOWMiLCJlbWFpbCI6InJvaGl0LnBhbnNhcmljZTlAZ21haWwuY29tIiwiaWF0IjoxNzI3NzU0MTMzLCJleHAiOjE3NjM3NTA1MzN9.11WZ2NTJGN6jOtRsmsDMXsyE-Vj5iPVTIYuT5GUiTQ4', // Replace with actual token or use a secure method
          },
          body: JSON.stringify({ location: { latitude, longitude } }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch parking lots');
      }

      const data = await response.json();
      setParkingLots(data.nearbyLots);
      setFilteredLots(data.nearbyLots);
    } catch (error) {
      console.error('Error fetching parking lots:', error);
      setErrorMsg('Failed to fetch parking lots. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [setParkingLots]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchParkingLots(location.latitude, location.longitude);
  }, [fetchParkingLots, location]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords.latitude, loc.coords.longitude);

      setMapRegion({
        ...INITIAL_REGION,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      await fetchParkingLots(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    const filtered = lots.filter(lot =>
      lot.lot.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLots(filtered);
  }, [searchQuery, lots]);

  const handleLotTap = (lot) => {
    navigation.navigate('singleLot', { id: lot._id });
  };

  const handleNavigation = async (lot) => {
    const lat = lot.location.coordinates[1]
    const long = lot.location.coordinates[0]
    const destination = `${lat},${long}`;
    const label = encodeURIComponent(lot.name);

    const url = `http://maps.apple.com/?q=${label}&ll=${destination}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Navigation Error',
        'Unable to open maps application. Please make sure you have a maps app installed.',
        [{ text: 'OK' }]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Spinner />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Pressable style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.userName}>Rohit</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('profile')}>
          <Image
            source={{ uri: 'https://example.com/profile-pic.jpg' }}
            style={styles.profilePic}
          />
        </Pressable>
      </View>

      

      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {filteredLots.map((lot) => (
          <Marker
            key={lot.lot._id}
            coordinate={{
              latitude: lot.lot.location.coordinates[1],
              longitude: lot.lot.location.coordinates[0],
            }}
          >
            <Callout tooltip onPress={() => handleLotTap(lot.lot)}>
              <View style={styles.calloutContainer}>
                <Image source={{ uri: lot.lot.img }} style={styles.calloutImage} />
                <Text style={styles.calloutTitle}>{lot.lot.name}</Text>
                <Text>Available Spots: {lot.lot.availableSpots}</Text>
                <Text>Distance: {(lot.lot.distance / 1000).toFixed(2)} km</Text>
                <Pressable
                  style={styles.navigateButton}
                  onPress={() => handleNavigation(lot.lot)}
                >
                  <Feather name="navigation" size={20} color="white" />
                  <Text style={styles.navigateButtonText}>Navigate</Text>
                </Pressable>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* <View style={styles.recentBookingsContainer}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        
        <Text style={styles.emptyStateText}>No recent bookings</Text>
      </View> */}

      

      <View style={styles.nearbyLotsContainer}>
        <Text style={styles.sectionTitle}>Parking Lots Around You</Text>
        <Text style={styles.sectionSubtitle}>Book a spot in advance hassle-free.</Text>
        <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search parking lots..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Feather name="search" size={24} color="#666" style={styles.searchIcon} />
      </View>
        {filteredLots.map((lot) => (
          <Pressable
            key={lot.lot._id}
            style={styles.lotCard}
            onPress={() => handleLotTap(lot.lot)}
          >
            <Image source={{ uri: lot.lot.img }} style={styles.lotImage} />
            <View style={styles.lotInfo}>
              <Text style={styles.lotName}>{lot.lot.name}</Text>
              <Text style={styles.lotHours}>Open till 10:30 PM</Text>
              <View style={styles.lotStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{lot.lot.availableSpots}</Text>
                  <Text style={styles.statLabel}>Available Spots</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {(lot.lot.distance / 1000).toFixed(2)}
                  </Text>
                  <Text style={styles.statLabel}>KMs</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  map: {
    height: 300,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  calloutContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: 200,
  },
  calloutImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  navigateButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  recentBookingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#666',
    fontStyle: 'italic',
  },
  nearbyLotsContainer: {
    margin: 16,
  },
  sectionSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  lotCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  lotImage: {
    width: '100%',
    height: 200,
  },
  lotInfo: {
    padding: 16,
  },
  lotName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lotHours: {
    color: '#666',
    marginBottom: 8,
  },
  lotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});