import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Animated, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

import Home from '@screens/Home/Home';
import Profile from '../screens/Profile/Profile';
import HomeWork from '../screens/HomeWork/HomeWork';
import Schedule from '../screens/Schedule/Schedule';
import Messages from '@screens/Message/Messages';
import { isPWA } from '@components/isPWA';
import { Gstyle } from '@styles/gstyles';

const Tab = createBottomTabNavigator();
const IsWeb = Platform.OS === 'web';

function AppTabs() {
  const { gstyles, isDark, GlobalColor } = Gstyle();
  const tabAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.timing(tabAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const opacity = tabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: (() => {
          if (route.name === 'Home') return 'Головна';
          if (route.name === 'HomeWork') return 'Завдання';
          if (route.name === 'Schedule') return 'Розклад';
          if (route.name === 'Profile') return 'Профіль';
          if (route.name === 'Message') return 'Листи';
          return route.name;
        })(),
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'HomeWork') iconName = focused ? 'document-text' : 'document-text-outline';
          if (route.name === 'Schedule') iconName = focused ? 'calendar' : 'calendar-outline';
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          if (route.name === 'Message') iconName = focused ? 'mail' : 'mail-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: GlobalColor,
        tabBarInactiveTintColor: isDark ? '#888888' : '#b0b3b8',

        tabBarBackground: () =>
          IsWeb ? (
            <View style={[gstyles.blur, { backgroundColor: isDark ? 'rgba(77,77,86,0.5)' : 'rgba(255,255,255,0.3)' }]}>
              <Animated.View style={{ flex: 1, overflow: 'hidden', opacity }} />
            </View>
          ) : (
            <Animated.View style={[{ flex: 1, overflow: 'hidden', opacity }]}>
              {Platform.OS === 'ios' ?
                <BlurView tint={isDark ? 'dark' : 'light'} intensity={30} style={[{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }, StyleSheet.absoluteFill]} />
                :
                <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#343438' : 'rgba(255,255,255,1)' }]} />
              }
            </Animated.View>
          ),
        tabBarStyle: {
          position: 'absolute',
          bottom: -1,
          height: isPWA() ? 83 : IsWeb ? null : 83,
          borderTopColor: isDark ? '#1c1c1e' : '#e4e4e6',
        },
      })}
    >

      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="HomeWork" component={HomeWork} />
      <Tab.Screen name="Schedule" component={Schedule} />
      <Tab.Screen name="Message" component={Messages} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default AppTabs;