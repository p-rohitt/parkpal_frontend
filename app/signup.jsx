'use client'

import React, { useState, useCallback } from 'react'
import { TextInput, Pressable, View, Image, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("User")
  const [vehicleType, setVehicleType] = useState('fourWheeler')
  const [showPassword, setShowPassword] = useState(false)

  const onSignUpPress = useCallback(async () => {
    if (!isLoaded) return

    try {
      const user = { username, emailAddress, password, role, vehicleType }
      console.log(user)

      // Uncomment and modify this section when ready to implement actual sign-up logic
      // const signUpAttempt = await signUp.create({
      //   username,
      //   emailAddress,
      //   password,
      // })

      // // Add custom fields
      // await signUpAttempt.update({
      //   unsafeMetadata: { role, vehicleType },
      // })

      // if (signUpAttempt.status === 'complete') {
      //   await setActive({ session: signUpAttempt.createdSessionId })
      //   router.replace(role === "User" ? "/home" : '/register-shop')
      // } else {
      //   console.error(JSON.stringify(signUpAttempt, null, 2))
      // }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, username, emailAddress, password, role, vehicleType])

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%', maxWidth: 350, padding: 24 }}
        >
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/2343/2343894.png" }}
              style={{ width: 96, height: 96, resizeMode: 'contain' }}
            />
            <Text style={{ marginTop: 16, fontSize: 32, fontWeight: 'bold', color: '#2563eb' }}>ParkPal</Text>
            <Text style={{ marginTop: 8, fontSize: 24, fontWeight: 'bold', color: '#4b5563' }}>Join today.</Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <TextInput
              autoCapitalize="none"
              value={username}
              placeholder="Username"
              onChangeText={setUsername}
              style={{
                backgroundColor: '#f3f4f6',
                padding: 16,
                borderRadius: 8,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#d1d5db'
              }}
            />
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email"
              onChangeText={setEmailAddress}
              keyboardType="email-address"
              style={{
                backgroundColor: '#f3f4f6',
                padding: 16,
                borderRadius: 8,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#d1d5db'
              }}
            />
            <View style={{ position: 'relative', marginBottom: 12 }}>
              <TextInput
                value={password}
                placeholder="Password"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                style={{
                  backgroundColor: '#f3f4f6',
                  padding: 16,
                  paddingRight: 60,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#d1d5db'
                }}
              />
              <Pressable 
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 16, top: 16 }}
              >
                <Text style={{ color: '#6b7280' }}>{showPassword ? 'Hide' : 'Show'}</Text>
              </Pressable>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 8, fontWeight: '600', color: '#4b5563' }}>Role:</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {['User', 'Lot Owner'].map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setRole(option)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: role === option ? '#2563eb' : '#d1d5db',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 8,
                      }}
                    >
                      {role === option && (
                        <View
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            backgroundColor: '#2563eb',
                          }}
                        />
                      )}
                    </View>
                    <Text style={{ color: '#4b5563' }}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            {role === 'User' && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, fontWeight: '600', color: '#4b5563' }}>Vehicle Type:</Text>
                <View style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, overflow: 'hidden' }}>
                  <Picker
                    selectedValue={vehicleType}
                    onValueChange={(itemValue) => setVehicleType(itemValue)}
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    <Picker.Item label="Four Wheeler" value="fourWheeler" />
                    <Picker.Item label="Two Wheeler" value="twoWheeler" />
                  </Picker>
                </View>
              </View>
            )}
          </View>

          <Pressable
            onPress={onSignUpPress}
            style={{
              backgroundColor: '#2563eb',
              borderRadius: 8,
              padding: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Sign Up</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: '#4b5563' }}>Already have an account? </Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={{ color: '#2563eb', fontWeight: '600' }}>Log in here</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  )
}