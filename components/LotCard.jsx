import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { FontAwesome, Ionicons } from '@expo/vector-icons'

const LotCard = ({item}) => {
  return (
    <Link href="">
        <View className="w-[95vw] mx-auto flex flex-row justify-between items-center p-4 bg-gray-200 mt-2 rounded-lg h-[15vh]">
            <View className="flex flex-col">
                <Text className="text-lg font-semibold tracking-wide">
                    {item.lot.name}
                </Text>
                <View className="flex flex-row gap-3">
                    {/* <Text className='text-sm'>
                        Total Spots : {item.totalSpots}
                    </Text> */}
                    <Text className='text-sm'>
                        Available Spots : {item.lot.availableSpots}
                    </Text>
                </View>

            </View>

            <View className="flex flex-col items-center justify-center gap-2">
            <FontAwesome name="circle" size={20} color="green" />
                <Text className="text-md font-bold">{(item.distance/1000).toFixed(1)}km</Text>
            </View>
        </View>
    </Link>
  )
}

export default LotCard