
import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, Image, StyleSheet, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
// import { LineChart } from 'react-native-chart-kit'
import { Bell, Search, Filter, DollarSign, Percent, Tool, Car, ActivityIcon, HammerIcon } from 'lucide-react-native'
import { ArrowUpRight, ArrowDownRight, IndianRupeeIcon} from 'lucide-react-native'
export default function LotOwnerHomeScreen() {
  const router = useRouter()
  const [parkingLots, setParkingLots] = useState([
    { id: 1, name: 'Jalukbari Junction Parking', type: 'Commercial', spots: 50, available: 15 },
    { id: 2, name: 'IIITG', type: 'Residential', spots: 100, available: 5 },
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Low occupancy in Jalukbari Junction Parking' },
    { id: 2, message: 'Wrong Parking at Spot 23 - IIITG' },
  ])

  const navigateToAddNewParkingLot = () => {
    router.push('/(owner)/home/add-new-parking-lot')
  }

  const navigateToLotDetails = (lotId) => {
    router.push(`/(owner)/home/lot-details`)
  }

  const filteredLots = parkingLots.filter(lot =>
    lot.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const occupancyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [65, 70, 80, 75, 85, 90, 95],
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2
      }
    ]
  }

  const revenueData = {
    total: 12500,
    thisMonth: 4200,
    today: 350,
    percentageChange: 5.2,
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2343/2343894.png" }}
            style={styles.logo}
          />
          <Text style={styles.title}>ParkPal</Text>
          <Text style={styles.subtitle}>Lot Owner Dashboard</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search parking lots..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Filter style={styles.filterIcon} />
        </View>

        <View style={styles.quickActions}>
          <Pressable style={styles.actionButton} onPress={navigateToAddNewParkingLot}>
            <Car style={styles.actionIcon} />
            <Text style={styles.actionText}>Add Lot</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <IndianRupeeIcon style={styles.actionIcon} />
            <Text style={styles.actionText}>Set Pricing</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Percent style={styles.actionIcon} />
            <Text style={styles.actionText}>Occupancy</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <HammerIcon style={styles.actionIcon} />
            <Text style={styles.actionText}>Maintenance</Text>
          </Pressable>
        </View>

        {/* <View style={styles.revenueOverview}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <Text style={styles.revenueText}>Total Revenue: 12,500</Text>
          <Text style={styles.revenueText}>This Month: 4,200</Text>
          <Text style={styles.revenueText}>Today: 350</Text>
        </View> */}

<View className="bg-white rounded-lg shadow-md p-4 mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-4">Revenue Overview</Text>
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-sm text-gray-500">Total Revenue</Text>
          <View className="flex-row items-center">
            <IndianRupeeIcon className="w-5 h-5 text-green-500 mr-1" />
            <Text className="text-2xl font-bold text-gray-900">{revenueData.total.toLocaleString()}</Text>
          </View>
        </View>
        <View className="flex-row items-center bg-green-100 rounded-full px-2 py-1">
          <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
          <Text className="text-sm font-medium text-green-700">{revenueData.percentageChange}%</Text>
        </View>
      </View>
      <View className="flex-row justify-between">
        <View className="bg-blue-50 rounded-lg p-3 flex-1 mr-2">
          <Text className="text-sm text-blue-700 mb-1">This Month</Text>
          <Text className="text-lg font-semibold text-blue-900">₹{revenueData.thisMonth.toLocaleString()}</Text>
        </View>
        <View className="bg-purple-50 rounded-lg p-3 flex-1 ml-2">
          <Text className="text-sm text-purple-700 mb-1">Today</Text>
          <Text className="text-lg font-semibold text-purple-900">₹{revenueData.today.toLocaleString()}</Text>
        </View>
      </View>
    </View>

        {/* <View style={styles.occupancyChart}>
          <Text style={styles.sectionTitle}>Occupancy Rate</Text>
          <LineChart
            data={occupancyData}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
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
        </View> */}

        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {notifications.map(notification => (
            <View key={notification.id} style={styles.notificationItem}>
              <Bell style={styles.notificationIcon} />
              <Text style={styles.notificationText}>{notification.message}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Your Parking Lots</Text>

        {filteredLots.map((lot) => (
          <Pressable
            key={lot.id}
            style={styles.lotCard}
            onPress={() => navigateToLotDetails(lot.id)}
          >
            <View style={styles.lotInfo}>
              <Text style={styles.lotName}>{lot.name}</Text>
              <Text style={styles.lotType}>
                {lot.type === 'city' ? 'City Parking' : 'Residential Parking'}
              </Text>
            </View>
            <View style={styles.lotStats}>
              <Text style={styles.statText}>Total Spots: {lot.spots}</Text>
              <Text style={styles.statText}>Available: {lot.available}</Text>
            </View>
          </Pressable>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Managing Your Parking Lots</Text>
          <Text style={styles.infoText}>
            • For city parking: Monitor real-time availability and set pricing.
          </Text>
          <Text style={styles.infoText}>
            • For residential parking: Assign spots to residents and manage guest parking.
          </Text>
          <Text style={styles.infoText}>
            Tap on a parking lot to view details, edit settings, or manage bookings.
          </Text>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
    color: '#4b5563',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  filterIcon: {
    marginLeft: 8,
    color: '#4b5563',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 12,
  },
  actionIcon: {
    color: '#2563eb',
    marginBottom: 4,
  },
  actionText: {
    color: '#2563eb',
    fontSize: 12,
  },
  revenueOverview: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  revenueText: {
    fontSize: 16,
    color: '#166534',
    marginBottom: 8,
  },
  occupancyChart: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  notificationsSection: {
    marginBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  notificationIcon: {
    color: '#dc2626',
    marginRight: 8,
  },
  notificationText: {
    color: '#7f1d1d',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  lotCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  lotInfo: {
    marginBottom: 8,
  },
  lotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  lotType: {
    fontSize: 14,
    color: '#4b5563',
  },
  lotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 14,
    color: '#4b5563',
  },
  infoSection: {
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0c4a6e',
  },
  infoText: {
    fontSize: 14,
    color: '#0c4a6e',
    marginBottom: 8,
  },
})