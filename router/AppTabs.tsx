import React, { useRef, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Animated, View, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import { BlurView } from 'expo-blur';


import Home from '@screens/Home/Home';
import Profile from '../screens/Profile/Profile';
import HomeWork from '../screens/HomeWork/HomeWork';
import Schedule from '../screens/Schedule/Schedule';
import Messages from '@screens/Message/Messages';
import { isPWA } from '@components/isPWA';
import { Gstyle } from '@styles/gstyles';
import usePageStore from '@store/PageStore';

const Tab = createBottomTabNavigator();
const IsWeb = Platform.OS === 'web';

export const tabs = [
  { name: 'Home', icon: 'home-outline', iconFocused: 'home', label: 'Головна', component: Home },
  { name: 'HomeWork', icon: 'document-text-outline', iconFocused: 'document-text', label: 'Завдання', component: HomeWork },
  { name: 'Message', icon: 'mail-outline', iconFocused: 'mail', label: 'Листи', component: Messages },
  { name: 'Schedule', icon: 'calendar-outline', iconFocused: 'calendar', label: 'Розклад', component: Schedule },
];
function AppTabs() {
  const { gstyles, isDark, GlobalColor } = Gstyle();
  const [tabWidth, setTabWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const { Page, SetPage } = usePageStore();



  useEffect(() => {
    Animated.spring(bubbleAnim, {
      toValue: selectedIndex,
      useNativeDriver: true,
      stiffness: 180,
      damping: 20,
      mass: 0.5,
    }).start();
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex(Page);
  }, [Page])

  const handleLayout = (e: LayoutChangeEvent) => setTabWidth(e.nativeEvent.layout.width);

  const handlePress = (index: number, e: any, originalPress: any) => {
    SetPage(index)
    originalPress?.(e);
  };

  return (
    <View style={{ flex: 1 }}>

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: isPWA() ? 32 : 16,
            marginHorizontal: 18,
            
            //@ts-ignore
            border: "none",
            borderRadius: 40,
            height: 63,
            backgroundColor: 'transparent',

          },
          tabBarLabel: () => null,
          tabBarBackground: () =>
            IsWeb ? (
              <View style={[StyleSheet.absoluteFill, gstyles.blur, { backgroundColor: isDark ? 'rgba(50, 50, 56, 0.5)' : 'rgba(255, 255, 255, 0.8)' }]}>
                <Animated.View style={{ flex: 1, }} />
                <View
                  style={{
                    position: 'absolute',
                    top: 1,
                    left: 1,
                    width: '90%',
                    height: '50%',
                    borderTopWidth: 0.05,
                    borderLeftWidth: 0.05,
                    borderColor: isDark ? 'rgba(87, 87, 95, 0.5)' : 'rgba(184, 184, 184, 0.5)',
                    borderTopLeftRadius: 40,
                    zIndex: 2,

                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 1,
                    right: 1,
                    width: '90%',
                    height: '50%',
                    borderBottomWidth: 0.05,
                    borderRightWidth: 0.05,
                    borderColor: isDark ? 'rgba(87, 87, 95, 0.5)' : 'rgba(184, 184, 184, 0.5)',
                    borderBottomRightRadius: 40,
                    zIndex: 2
                  }}
                />
              </View>
            ) : (
              <Animated.View style={[{ flex: 1, overflow: 'hidden' }]}>
                {Platform.OS === 'ios' ? (
                  <BlurView
                    tint={isDark ? 'dark' : 'light'}
                    intensity={30}
                    style={[
                      { backgroundColor: 'rgba(255,255,255,0.18)' },
                      StyleSheet.absoluteFill,
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: isDark
                          ? '#343438'
                          : 'rgba(255,255,255,1)',
                      },
                    ]}
                  />
                )}
              </Animated.View>
            ),
        }}
      >

        {
          tabs.map((tab, index) => (
            <Tab.Screen
              key={tab.name}
              name={tab.name}
              component={tab.component}
              options={{
                tabBarButton: (props) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <Pressable
                      onLayout={index === 0 ? handleLayout : undefined}
                      onPress={(e) => handlePress(index, e, props.onPress)}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons
                        name={
                          isSelected
                            ? (tab.iconFocused as any)
                            : (tab.icon as any)
                        }
                        size={24}
                        color={
                          isSelected
                            ? GlobalColor
                            : isDark
                              ? '#888888'
                              : '#b0b3b8'
                        }
                      />
                      <Animated.Text
                        style={{
                          marginTop: -3,
                          fontSize: 12,
                          color: isSelected
                            ? GlobalColor
                            : isDark
                              ? '#969696'
                              : '#b0b3b8',
                          fontWeight: '500',
                          opacity: isSelected ? 1 : 0.7,
                        }}
                      >
                        {tab.label}
                      </Animated.Text>
                    </Pressable>
                  );
                },
              }}
            />
          ))

        }

      </Tab.Navigator >



      {/* <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '8%',
          backgroundColor: "black",
          zIndex: 1,
        }}
      /> */}

      {
        tabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              bottom: isPWA() ? 36 : 20,
              width: tabWidth * 0.9,
              height: 55,
              borderRadius: 40,
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(137,137,137,0.1)',
              borderWidth: 1,
              borderColor: isDark
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.04)',
              transform: [
                {
                  translateX: bubbleAnim.interpolate({
                    inputRange: [0, tabs.length - 1],
                    outputRange: [
                      14 + tabWidth * 0.095,
                      14 + (tabs.length - 1) * tabWidth + tabWidth * 0.0655,
                    ],
                  }),
                },
                { translateY: -0.1 },
              ],
            }}
          />
        )
      }
    </View >
  );
}

export default AppTabs;