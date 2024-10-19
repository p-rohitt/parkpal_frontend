import { Stack } from 'expo-router';
import React from 'react';

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="add-new-parking-lot"
        options={{
          title: 'Add New Parking Lot',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="lot-details"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}