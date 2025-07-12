import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { View, Animated, Platform } from 'react-native';

import Home from './screens/Home';
import Profile from './screens/Profile';
import useLoadingStore from './store/LoadStore';
import HomeWork from './screens/HomeWork';
import Login from './screens/Login';
import { getData } from './components/LocalStorage';
import Schedule from './screens/Schedule';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Router() {
  const load = useLoadingStore((state) => state.load);
  const [initialScreen, setInitialScreen] = useState<string | null>(null);
  const [tabAnim] = useState(new Animated.Value(0));



  useEffect(() => {
    const checkLogin = async () => {
      const login = await getData('login');
      setInitialScreen(login ? 'App' : 'Login');
    };
    checkLogin();
  }, []);

  useEffect(() => {
    Animated.timing(tabAnim, {
      toValue: load ? 0 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

  }, [load]);



  return (
    <NavigationContainer>

      <Stack.Navigator screenOptions={{ headerShown: false }}>


        {initialScreen === 'Login' ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <Stack.Screen name="App" options={{ headerShown: false }}>

            {(props) => (

              <Tab.Navigator
                screenOptions={({ route }: { route: RouteProp<any> }) => ({
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
                {...props}
              >
                <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Головна' }} />
                <Tab.Screen name="HomeWork" component={HomeWork} options={{ tabBarLabel: 'Домашка' }} />
                <Tab.Screen name="Schedule" component={Schedule} options={{ tabBarLabel: 'Розклад' }} />
                <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Профіль' }} />
              </Tab.Navigator>



            )}
          </Stack.Screen>

        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}