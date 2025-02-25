import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from './src/screens/loggedout/LoginScreen';
import LandingScreen from './src/screens/loggedout/LandingScreen';
import AboutScreen from './src/screens/AboutScreen';
import MainTabs from './src/navigation/MainTabs';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { Colours } from './src/styles/shared';
import LoadingComp from './src/components/customComponents/LoadingComp';
import { Text, TextInput } from 'react-native';

const Stack = createNativeStackNavigator();

const preloadAssets = async () => {
  const imageAssets = [
    require('./assets/background-geometric.png'),
    require('./assets/logo-strip.png'),
    require('./assets/arabesque.png'),
  ];

  const imagePromises = imageAssets.map(image => {
    return Asset.loadAsync(image);
  });

  const fontPromises = Font.loadAsync({
    'ClashGrotesk-Light': require('./assets/fonts/ClashGrotesk-Light.ttf'),
    'ClashGrotesk': require('./assets/fonts/ClashGrotesk-Medium.ttf'),
    'ArefRuqaa': require('./assets/fonts/ArefRuqaa-Regular.ttf'),
    'ArefRuqaa-Bold': require('./assets/fonts/ArefRuqaa-Bold.ttf'),
    'NotoKufiArabic': require('./assets/fonts/NotoKufiArabic-Regular.ttf'),
    'NotoKufiArabic-Bold': require('./assets/fonts/NotoKufiArabic-Bold.ttf'),
  });

  await Promise.all([...imagePromises, fontPromises]);
};

function AppNavigator() {
  const { user, isLoading: authLoading } = useAuth();
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    async function loadAllAssets() {
      try {
        await preloadAssets();
        setAssetsLoaded(true);
      } catch (error) {
        console.error('Error loading assets:', error);
        setAssetsLoaded(true);
      }
    }

    loadAllAssets();
  }, []);

  if (!assetsLoaded || authLoading) {
    return (
      <LoadingComp />
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
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
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
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerTintColor: Colours.decorative.purple,
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
              headerTintColor: Colours.decorative.purple,
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