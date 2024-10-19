import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'

const login = () => {
  const { user } = useUser()

  return (
    <SafeAreaView>
       <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Link href="/login">
          <Text>Sign In</Text>
        </Link>
        <Link href="/signup">
          <Text>Sign Up</Text>
        </Link>
        <Link href="/(owner)/home">
          <Text>Owner Screen</Text>
        </Link>
        <Link href="/(owner)/home/lot-details">
          <Text>Owner Screen</Text>
        </Link>
      </SignedOut>
    </View>
    </SafeAreaView>
  );
}

export default login