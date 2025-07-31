import { StyleSheet, useColorScheme } from 'react-native';

export const Gstyle = () => {
  const isDark: boolean = useColorScheme() === 'dark';

  const gstyles = StyleSheet.create({
    back: {
      backgroundColor: isDark ? '#1a1a1f' : '#f7f7fa',
    },
    WidgetBack: {
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
    },
    container: {
      flex: 1,
      backgroundColor: '#f7f7fa',
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

  const ChatText = isDark ? '#ffffff' : '#333333';
  const ChatTitle = isDark ? '#ffffff' : '#222222';
  
  const Login = isDark ? '#1d1d26' : '#fff';




  return {
    gstyles,
    WidgetColorText,
    Circle,
    MessageTopicText,
    ProfilText,
    ProfilTextValue,
    ProfilCircle,
    ChatText,
    ChatTitle,
    Login
  };
};