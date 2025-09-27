import React, { useEffect, useState } from 'react';
import { NavigationContainer, LinkingOptions, NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';


import Login from '../screens/UtilityScreens/Login';
import Stop from '@screens/UtilityScreens/Error';
import FullMessage from '@screens/Message/Message';
import Diary from '@screens/Diary/Diary';
import AppTabs from './AppTabs';


import { getData } from '@components/LocalStorage';
import { StackNavigationProp } from '@react-navigation/stack';



const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['http://localhost:8081', 'https://fastshark.xyz'],
  config: {
    screens: {
      Login: 'login',
      App: {
        screens: {
          Home: '',
          HomeWork: 'homework',
          Schedule: 'schedule',
          Message: 'messages',
          Profile: 'profile',
        } as Record<keyof AppTabParamList, string>,
      },
      FullMessage: 'message/:id',
      Diary: 'diary',
      Stop: 'stop',
    },
  },
};


export type AppTabParamList = {
  Home: undefined;
  Message: undefined;
  Profile: undefined;
  HomeWork: undefined;
  Schedule: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  App: NavigatorScreenParams<AppTabParamList>;
  FullMessage: {
    item: any;
    status: number;
  };
  Diary: undefined;
  Stop: undefined;
  CreateMessage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


const LoadingScreen = () => (
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7'
  }}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);


const screenOptions = {
  headerShown: false,
  gestureEnabled: true,
  animation: 'slide_from_right' as const,
};

const modalScreenOptions = {
  ...screenOptions,
  presentation: 'modal' as const,
  animation: 'slide_from_bottom' as const,
}; export default function Router() {
  const [initialScreen, setInitialScreen] = useState<"App" | "Login" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);

        const [login, tokens] = await Promise.all([
          getData("login"),
          getData("tokens"),
        ]);

        const isAuthenticated = Boolean(login && tokens);

        setInitialScreen(isAuthenticated ? "App" : "Login");
      } catch (error) {
        console.error("Помилка ініціалізації:", error);
        setInitialScreen("Login");
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading || !initialScreen) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer linking={initialScreen === "Login" ? undefined : linking} fallback={<LoadingScreen />}>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName={initialScreen} 
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="App"
          component={AppTabs}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="FullMessage"
          component={FullMessage}
          options={{ title: "Повідомлення", ...modalScreenOptions }}
        />
        <Stack.Screen
          name="Diary"
          component={Diary}
          options={{ title: "Щоденник", ...modalScreenOptions }}
        />
        <Stack.Screen
          name="Stop"
          component={Stop}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}