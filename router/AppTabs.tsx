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
import { Gstyle } from 'styles/gstyles';

const Tab = createBottomTabNavigator();
const IsWeb = Platform.OS === 'web';

function AppTabs() {
  const { gstyles, isDark } = Gstyle();
  const tabAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.timing(tabAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const translateY = tabAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
  const opacity = tabAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'HomeWork') iconName = focused ? 'document-text' : 'document-text-outline';
          if (route.name === 'Schedule') iconName = focused ? 'calendar' : 'calendar-outline';
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          if (route.name === 'Message') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          return <Ionicons style={{ top: 10 }} name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#b0b3b8',
        tabBarShowLabel: false,
        tabBarBackground: () =>
          IsWeb ? (
            <View style={[gstyles.blur, { backgroundColor: isDark ? 'rgba(77,77,86,0.5)' : 'rgba(255,255,255,0.3)' }]}>
              <Animated.View style={{ flex: 1, borderRadius: 24, overflow: 'hidden', opacity }} />
            </View>
          ) : (
            <Animated.View style={[{ flex: 1, borderRadius: 24, overflow: 'hidden', opacity }]}>



              {Platform.OS === 'ios' ?
                <BlurView tint={isDark ? 'dark' : 'light'} intensity={30} style={[{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }, StyleSheet.absoluteFill]} />
                :
                <View style={[StyleSheet.absoluteFill, { borderRadius: 24, backgroundColor: isDark ? '#343438' : 'rgba(255,255,255,1)' }]} />
              }

            </Animated.View>
          ),
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          marginHorizontal: 16,
          bottom: isPWA() ? 32 : 16,
          borderRadius: 24,
          height: 64,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 12,
          transform: [{ translateY }],
          elevation: 3,
          zIndex: 1,
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