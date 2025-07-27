import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Stop from '@screens/Error';
import FullMessage from '@screens/Message/Chat';
import AppTabs from './AppTabs';

import { getData } from '@components/LocalStorage';

export type AppTabParamList = {
  Home: undefined;
  Message: undefined;
  Profile: undefined;
};
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  FullMessage: undefined;
  Stop: undefined;
  App: {
    screen?: keyof AppTabParamList;
  };
};
const Stack = createNativeStackNavigator();

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
        <Stack.Screen name="FullMessage" component={FullMessage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}