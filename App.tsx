import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import LandingScreen from './src/screens/LandingScreen';
import AboutScreen from './src/screens/AboutScreen';
import MainTabs from './src/navigation/MainTabs';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { useEffect } from 'react';
import { apiClient } from './src/utils/apiClient';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, isLoading, updateUser } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' }
      }}
    >
      {user ? (
        // Authenticated stack
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        // Public stack
        <Stack.Group>
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerShown: true,
              title: '',
              headerBackTitle: 'Back'
            }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{
              headerShown: true,
              title: '',
              headerBackTitle: 'Back',
              headerBackTitleVisible: true,
              headerTransparent: true,
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}