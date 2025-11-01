import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';

import Login from '../screens/UtilityScreens/Login';
import Stop from '@screens/UtilityScreens/Error';
import FullMessage from '@screens/Message/Message';
import Diary from '@screens/Diary/Diary';
import AppTabs from './AppTabs';
import { getData } from '@components/LocalStorage';
import Teachers from '@screens/MyTeachers/Teachers';
import { Gstyle } from '@styles/gstyles';
import Profile from '@screens/Profile/Profile';

// linking config
const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Login: 'login',
      App: {
        screens: {
          Home: '',
          HomeWork: 'homework',
          Message: 'messages',
          Schedule: 'schedule',
          Profile: 'profile',
        },
      },
      FullMessage: 'message/:id',
      Diary: 'diary',
      Teachers: 'teachers',
      Stop: 'stop',
    },
  },
};

// Types
export type AppTabParamList = {
  Home: undefined;
  Message: undefined;
  Profile: undefined;
  Teachers: undefined;
  HomeWork: undefined;
  Schedule: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  App: {
    screen?: keyof AppTabParamList;
  };
  FullMessage: {
    id: any
    status: number;
  };
  Teachers: undefined;
  Diary: undefined;
  Stop: undefined;
  CreateMessage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => {
  const { GlobalColor } = Gstyle();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
      }}
    >
      <ActivityIndicator size="large" color={GlobalColor} />
    </View>
  );
};

const screenOptions = {
  headerShown: false,
  gestureEnabled: true,
  animation: 'slide_from_right' as const,
};

const modalScreenOptions = {
  ...screenOptions,
  presentation: 'modal' as const,
  animation: 'slide_from_bottom' as const,
};
export default function Router() {
  const [initialScreen, setInitialScreen] = useState<'Login' | 'App' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const navigationRef = React.useRef<any>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const [login, tokens] = await Promise.all([
          getData('login'),
          getData('tokens'),
        ]);
        const isAuthenticated = Boolean(login && tokens);
        setInitialScreen(isAuthenticated ? 'App' : 'Login');
      } catch (error) {
        console.error('Ошибка инициализации:', error);
        setInitialScreen('Login');
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);


  useEffect(() => {
    if (initialScreen && !isLoading && navigationRef.current && !ready) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: initialScreen }],
      });
      setReady(true);
    }
  }, [initialScreen, isLoading, ready]);

  if (isLoading || !initialScreen) return <LoadingScreen />;

  return (
    <NavigationContainer
      //@ts-ignore
      linking={linking}
      fallback={<LoadingScreen />}
      ref={navigationRef}
    >
      <Stack.Navigator screenOptions={screenOptions} initialRouteName={initialScreen}>
        <Stack.Group>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ ...screenOptions, gestureEnabled: false }}
          />
        </Stack.Group>

        <Stack.Group>
          <Stack.Screen
            name="App"
            component={AppTabs}
            options={{ ...screenOptions, gestureEnabled: false }}
          />
        </Stack.Group>

        <Stack.Group screenOptions={modalScreenOptions}>
          <Stack.Screen name="FullMessage" component={FullMessage} options={{ ...modalScreenOptions, title: 'Повідомлення' }} />
          <Stack.Screen name="Diary" component={Diary} options={{ ...modalScreenOptions, title: 'Щоденник' }} />
          <Stack.Screen name="Teachers" component={Teachers} options={{ ...modalScreenOptions, title: 'Teachers' }} />
          <Stack.Screen name="Profile" component={Profile} options={{ ...modalScreenOptions, title: 'Профіль' }} />
        </Stack.Group>

        <Stack.Group>
          <Stack.Screen name="Stop" component={Stop} options={{ ...screenOptions, gestureEnabled: false }} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
