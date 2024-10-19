'use client'

import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState, useCallback } from 'react'
import { Text, TextInput, View, KeyboardAvoidingView, Image, Pressable, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSignInPress = useCallback(async () => {
    router.push("/(user)")
    // if (!isLoaded) return
    // try {
    //   const signInAttempt = await signIn.create({
    //     identifier: username,
    //     password,
    //   })
    //   if (signInAttempt.status === 'complete') {
    //     await setActive({ session: signInAttempt.createdSessionId })
    //     router.replace('/')
    //   } else {
    //     console.error(JSON.stringify(signInAttempt, null, 2))
    //   }
    // } catch (err: any) {
    //   console.error(JSON.stringify(err, null, 2))
    // }
  }, [ username, password])

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ width: '100%', maxWidth: 350, padding: 24 }}
      >
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2343/2343894.png" }}
            style={{ width: 120, height: 120, resizeMode: 'contain' }}
          />
          <Text style={{ marginTop: 16, fontSize: 32, fontWeight: 'bold', color: '#2563eb' }}>ParkPal</Text>
          <Text style={{ marginTop: 8, color: '#4b5563', textAlign: 'center' }}>
            Your Spot, Just a Tap Away.
          </Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <TextInput
            autoCapitalize="none"
            value={username}
            placeholder="Username"
            style={{
              backgroundColor: '#f3f4f6',
              padding: 16,
              borderRadius: 8,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#d1d5db'
            }}
            onChangeText={setUsername}
          />

          <View style={{ position: 'relative' }}>
            <TextInput
              value={password}
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={{
                backgroundColor: '#f3f4f6',
                padding: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#d1d5db'
              }}
              onChangeText={setPassword}
            />
            <Pressable 
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 16, top: 16 }}
            >
              <Text style={{ color: '#6b7280' }}>{showPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={onSignInPress}
          style={{
            backgroundColor: '#2563eb',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Sign In</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ color: '#4b5563' }}>Not a member yet? </Text>
          <Link href="/signup">
            <Text style={{ color: '#2563eb', fontWeight: '600' }}>Sign up here</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

