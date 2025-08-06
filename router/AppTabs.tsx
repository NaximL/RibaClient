import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Font from 'expo-font';

import Home from '@screens/Home/Home';
import Profile from '../screens/Profile';
import useLoadingStore from '../store/LoadStore';
import HomeWork from '../screens/HomeWork/HomeWork';
import Schedule from '../screens/Schedule';
import ChoiceChat from '@screens/Message/ChoiceChat';
import Diary from '@screens/Diary/Diary';

const Tab = createBottomTabNavigator();

function AppTabs() {
    const load = useLoadingStore((state) => state.load);
    const setLoad = useLoadingStore((state) => state.setLoad);

    
    const tabAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync(Ionicons.font);
                setLoad(false);
            } catch (error) {
                console.error("Помилка завантаження іконок:", error);
            }
        };

        loadFonts();
    }, []);

    useEffect(() => {
        
        Animated.timing(tabAnim, {
            toValue: load ? 0 : 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [load, tabAnim]);

    const translateY = tabAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0],
    });

    const opacity = tabAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

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
                    if (route.name === 'Diary') iconName = focused ? 'stats-chart' : 'stats-chart-outline';


                    return <Ionicons style={{ top: 10 }} name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#007aff',
                tabBarInactiveTintColor: '#b0b3b8',
                tabBarShowLabel: false,
                tabBarBackground: () => (
                    <Animated.View
                        style={{
                            flex: 1,
                            borderRadius: 24,
                            overflow: 'hidden',
                            opacity: opacity,
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
                    alignContent: "center",
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
                    transform: [{ translateY }],
                    elevation: 3,
                    zIndex: 1,
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="HomeWork" component={HomeWork} />
            <Tab.Screen name="Schedule" component={Schedule} />
            <Tab.Screen name="Diary" component={Diary} />
            <Tab.Screen name="Message" component={ChoiceChat} />
            <Tab.Screen name="Profile" component={Profile} />

        </Tab.Navigator>
    );
}

export default AppTabs;