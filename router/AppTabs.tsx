import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';

import Home from '@screens/Home/Home';
import Profile from '../screens/Profile';
import useLoadingStore from '../store/LoadStore';
import HomeWork from '../screens/HomeWork';
import Schedule from '../screens/Schedule';
import ChoiceChat from '@screens/Message/ChoiceChat';

const Tab = createBottomTabNavigator();

function AppTabs() {
    const load = useLoadingStore((state) => state.load);
    const [tabAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(tabAnim, {
            toValue: load ? 0 : 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [load]);

    const translateY = tabAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0],
    });

    const opacity = tabAnim;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, focused }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

                    if (route.name === 'Home') iconName = focused ? 'sparkles' : 'sparkles-outline';
                    if (route.name === 'HomeWork') iconName = focused ? 'document-text' : 'document-text-outline';
                    if (route.name === 'Schedule') iconName = focused ? 'calendar' : 'calendar-outline';
                    if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
                    if (route.name === 'Message') iconName = focused ? 'chatbubble' : 'chatbubble-outline';

                    return <Ionicons style={{ marginTop: 20 }} name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#007aff',
                tabBarInactiveTintColor: '#b0b3b8',
                tabBarShowLabel: false,
                tabBarLabelStyle: {
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: '600',
                    letterSpacing: 0.2,
                },

                
                tabBarBackground: () => (
                    <Animated.View
                        style={{
                            flex: 1,
                            borderRadius: 24,
                            overflow: 'hidden',
                            transform: [{ translateY }],
                            opacity,
                        }}
                    >
                        <BlurView
                            tint="light"
                            intensity={30} 
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                            }}
                        />
                    </Animated.View>
                ),

                tabBarStyle: {
                    position: 'absolute',
                    alignSelf: 'center',
                    left: 0,
                    right: 0,
                    marginHorizontal: 16,
                    bottom: Platform.OS === 'ios' ? 32 : 16,
                    borderRadius: 24,
                    height: 64,
                    borderTopWidth: 0,
                    backgroundColor: 'transparent',
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 12,
                    elevation: 10,
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="HomeWork" component={HomeWork} />
            <Tab.Screen name="Schedule" component={Schedule} />
            <Tab.Screen name="Message" component={ChoiceChat} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

export default AppTabs;