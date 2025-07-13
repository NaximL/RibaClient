import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Animated, Platform } from 'react-native';

import Home from '@screens/Home/Home';
import Profile from './screens/Profile';
import useLoadingStore from './store/LoadStore';
import HomeWork from './screens/HomeWork';
import Login from './screens/Login';
import { getData } from './components/LocalStorage';
import Schedule from './screens/Schedule';
import Stop from '@screens/Error';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  App: undefined;
  Stop: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function AppTabs() {
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

  const load = useLoadingStore((state) => state.load);
  const [tabAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {

    fetch('https://67e479672ae442db76d48b54.mockapi.io/allert')
      .then(response => response.json())
      .then(data => {
        if (data[0]?.status === true) {
          navigation.replace('Stop');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })

    Animated.timing(tabAnim, {
      toValue: load ? 0 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [load]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Home') iconName = focused ? 'sparkles' : 'sparkles-outline';
          if (route.name === 'HomeWork') iconName = focused ? 'document-text' : 'document-text-outline';
          if (route.name === 'Schedule') iconName = focused ? 'calendar' : 'calendar-outline';
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons style={{ marginTop: 4 }} name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#b0b3b8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          marginTop: 4,
          fontSize: 14,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        tabBarStyle: {
          position: 'absolute',
          alignSelf: 'center',
          left: 0,
          right: 0,
          marginHorizontal: 16,
          bottom: Platform.OS === 'ios' ? 32 : 16,
          borderRadius: 24,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 12,
          elevation: 10,
          height: 64,
          borderTopWidth: 0,
          backgroundColor: `rgba(255,255,255,0.8)`,
          backdropFilter: 'blur(5px)',
          transform: [{ scale: tabAnim }],
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Головна' }} />
      <Tab.Screen name="HomeWork" component={HomeWork} options={{ tabBarLabel: 'Домашка' }} />
      <Tab.Screen name="Schedule" component={Schedule} options={{ tabBarLabel: 'Розклад' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Профіль' }} />
    </Tab.Navigator>
  );
}

export default function Router() {
  const [initialScreen, setInitialScreen] = useState<'Login' | 'App' | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const login = await getData('login');
      setInitialScreen(login ? 'App' : 'Login');
    };
    checkLogin();
  }, []);

  if (!initialScreen) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialScreen}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="App" component={AppTabs} />
        <Stack.Screen name="Stop" component={Stop} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}