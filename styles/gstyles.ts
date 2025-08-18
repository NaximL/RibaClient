import { Platform, useColorScheme, StyleSheet } from 'react-native';
import { useEffect } from 'react';

export const Gstyle = () => {
  const isDark: boolean = useColorScheme() === 'dark';

  const backgroundColor = isDark ? '#1a1a1f' : '#f7f7fa';

  useEffect(() => {
    if (Platform.OS === 'web') {

      let metaThemeColor = document.querySelector("meta[name=theme-color]");
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', backgroundColor);


      let appleStatusBar = document.querySelector("meta[name=apple-mobile-web-app-status-bar-style]");
      if (!appleStatusBar) {
        appleStatusBar = document.createElement('meta');
        appleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(appleStatusBar);
      }
      appleStatusBar.setAttribute('content', 'black-translucent');


      document.body.style.backgroundColor = backgroundColor;
    }
  }, [isDark]);

  const gstyles = StyleSheet.create({
    back: {
      backgroundColor,
    },
    WidgetBack: {
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
    },
    LoadingBack: {
      backgroundColor: isDark ? 'rgba(150, 150, 150, 0.1)' : '#fff',
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const Circle = isDark ? '#33333a' : 'rgba(255,255,255,0.9)';
  const WidgetColorText = isDark ? '#ffffff' : '#000000';
  const MessageTopicText = isDark ? '#ffffff' : '#1c1c1e';
  const ProfilText = isDark ? '#ffffff' : '#222';
  const ProfilTextValue = isDark ? '#ffffff' : '#444';
  const ProfilCircle = isDark ? '#33333a' : '#f2f2f7';
  const LoginText = isDark ? 'rgb(126 126 126)' : '#000000';
  const ChatText = isDark ? '#ffffff' : '#333333';
  const ChatTitle = isDark ? '#ffffff' : '#222222';
  const Login = isDark ? '#1d1d26' : '#fff';

  const MessageBuble = isDark ? '#2c2c2e' : '#e5e5ea';
  const MessageBubleActive = isDark ? '#3390ec' : '#007aff';
  const MessageBubleText = isDark ? '#fff' : '#000';
  const MessageBubleTextActive = '#fff';
  
  return {
    isDark,
    gstyles,
    WidgetColorText,
    Circle,
    MessageTopicText,
    ProfilText,
    ProfilTextValue,
    ProfilCircle,
    ChatText,
    ChatTitle,
    Login,
    LoginText,
    MessageBuble,
    MessageBubleActive,
    MessageBubleText,
    MessageBubleTextActive
  };
};