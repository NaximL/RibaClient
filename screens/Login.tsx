import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator
} from 'react-native';
import { storeData } from "../components/LocalStorage"
import { GetAllData } from '../api/MH/GetAlldata';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../router';
import { ISPROD } from 'config/config';
import UseErrorStore from '@store/Error';
import { Logins } from '@api/Login';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const loginRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [logins, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [Load, SetLoad] = React.useState(false);

  const [anim] = React.useState(new Animated.Value(0));
  const seterrors = UseErrorStore((state) => state.setError);

  const navigation = useNavigation<NavigationProp>();
  function del(str: string): string {
    if (str.endsWith(' ')) {
      return str.slice(0, -1);
    }
    return str;
  }
  const Save = () => {
    setLogin(del(logins));
    setPassword(del(password));

    if (!logins.trim()) {
      alert('Будь ласка, введіть логін');
      return;
    }
    if (!password.trim()) {
      alert('Будь ласка, введіть пароль');
      return;
    }
    SetLoad(true);
    Logins(logins, password).then((sts) => {
      console.log(sts.sts)
      if (sts.sts) {
        storeData("login", logins);
        storeData("password", password);
        alert('Ви успішно увійшли!');
        navigation.replace('App');
      }
      else {
        alert('Невірний логін або пароль');
        SetLoad(false);
      }
    }).catch((e) => {
      alert('Невірний логін або пароль');
      console.error(e);
      SetLoad(false);
    });
  };

  useEffect(() => {
    if (ISPROD) {

      fetch('https://67e479672ae442db76d48b54.mockapi.io/allert')
        .then(response => response.json())
        .then(data => {
          if (data[0]?.status === true) {
            seterrors(data[0])
            navigation.replace('Stop');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
    }

    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    loginRef.current?.focus();
  }, []);

  return (
    <>
      {Load === true ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007aff" />
        </View>
        :

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: '#f7f7fa' }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Animated.View style={{
              ...styles.wrapper,
              opacity: anim,
              transform: [
                { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }
              ]
            }}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/Icons/icon.png')}
                  resizeMode="contain"
                  style={styles.logo}
                />
                <Text style={styles.title}>FastShark</Text>
                <Text style={styles.subtitle}>Пірнай у нормальний клієнт моєї школи</Text>
              </View>
              <View style={styles.form}>
                <TextInput
                  ref={loginRef}
                  style={styles.input}
                  placeholder="Логін"
                  placeholderTextColor="#b0b3b8"
                  returnKeyType="next"
                  value={logins}
                  onChangeText={setLogin}
                  autoCapitalize="none"
                />
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  placeholder="Пароль"
                  placeholderTextColor="#b0b3b8"
                  returnKeyType="done"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={Save}>
                  <Text style={styles.buttonText}>Увійти</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      }
    </>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f7fa',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#f7f7fa',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 32,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 2,
    marginBottom: 10,
  },
  form: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    elevation: 3,
  },
  input: {
    backgroundColor: '#f2f2f7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
    fontSize: 17,
    color: '#222',
    borderColor: '#e5e5ea',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007aff',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: 0.2,
  },
});

export default Login;