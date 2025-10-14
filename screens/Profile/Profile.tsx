import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Platform, Image } from 'react-native'
import useProfileStore from '../../store/ProfileStore';
import { getData, removeData, storeData } from '../../components/LocalStorage';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../router/router';
import { VERSION } from '../../config/config';
import { Gstyle } from '@styles/gstyles';
import { fetchData } from '@api/MH/GetAlldata';
import useLesionStore from '@store/LesionStore';
import FullScreenModal from '@components/Modal';



export default function Profile() {
  const { gstyles, ProfilText, WidgetColorText, ProfilTextValue, ProfilCircle, GlobalColor } = Gstyle();

  type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
  const { Prof, setProfile } = useProfileStore();
  const [Bal, setBal] = useState<string>("0.00")
  const setLesions = useLesionStore((state) => state.setLesions);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const [login, setLogin] = React.useState<string | null>(null);
  const [anim] = React.useState(new Animated.Value(0));

  let pazinichi = 0;

  const Pazinich = () => {
    pazinichi++;

    if (pazinichi === 3) {
      pazinichi = 0;

      const secrets = [
        "homyak",
      ];

      const randomIndex = Math.floor(Math.random() * secrets.length);
      if (secrets[randomIndex] === "homyak") {
        setModalVisible(true)
      }
      else {
        alert(secrets[randomIndex]);
      }
    }
  };


  const [swStatus, setSwStatus] = useState<string>('Не проверялось');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) {
          setSwStatus('Service Worker не зарегистрирован');
          return;
        }

        const sw = reg.active || reg.waiting || reg.installing;

        if (!sw) {
          setSwStatus('Нет активного Service Worker');
          return;
        }

        switch (sw.state) {
          case 'installing':
            setSwStatus('Service Worker устанавливается');
            break;
          case 'installed':
            setSwStatus('Service Worker установлен (кэш готов)');
            break;
          case 'activating':
            setSwStatus('Service Worker активируется');
            break;
          case 'activated':
            setSwStatus('Service Worker активен');
            break;
          case 'redundant':
            setSwStatus('Service Worker устарел (redundant)');
            break;
          default:
            setSwStatus(`Неизвестное состояние: ${sw.state}`);
        }

        sw.addEventListener('statechange', () => {
          setSwStatus(`Service Worker сейчас: ${sw.state}`);
        });
      });
    } else {
      setSwStatus('Service Worker не поддерживается');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }).start();


    }, [])
  );



  const SetupProfile = async () => {
    const profile = await getData("profile");
    const homepage = await getData("homepage");
    if (!homepage) return;
    const bal = JSON.parse(homepage)[14];
    setBal(bal);
    if (!profile) {
      const tokens = await getData("tokens");
      if (!tokens) return
      const new_profile = await fetchData("profile", tokens);
      await storeData("profile", JSON.stringify(new_profile))
      setProfile(new_profile)
    }
    else {
      setProfile(JSON.parse(profile));
    }
  }

  useEffect(() => {
    SetupProfile()
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    getData('login').then(setLogin);
  }, []);
  const logout = async () => {
    await removeData('login');
    await removeData('password');
    await removeData('tokens');
    await removeData('homepage');
    await removeData('schedule');
    await removeData('profile');
    await removeData('token_app');
    await removeData('check');
    navigation.navigate('Login');
  };


  const update = async () => {
    const token = await getData("tokens");
    if (!token) return;
    try {
      const sc = await fetchData("schedule", token);
      await storeData('schedule', JSON.stringify(sc));
      alert("Розклад оновлено")
      setLesions(sc)
      navigation.replace("App", { screen: "Schedule" });
    }
    catch (error) {
      alert(`Помилка:${error}`)
    }

  };


  {/* <View style={styles.teachersBlock}>
          <Text style={styles.teachersTitle}>Мої вчителі</Text>
          <View style={styles.teachersList}>
            
            <View style={[styles.teacherCard, styles.teacherMath]}>
              <View style={[styles.teacherIconCircle, styles.teacherMathIcon]}>
                <Text style={styles.teacherMathIconText}>📐</Text>
              </View>
              <View>
                <Text style={styles.teacherMathTitle}>Математика</Text>
                <Text style={styles.teacherName}>Олена Петрівна Ковальчук</Text>
              </View>
            </View>
            
            <View style={[styles.teacherCard, styles.teacherUkr]}>
              <View style={[styles.teacherIconCircle, styles.teacherUkrIcon]}>
                <Text style={styles.teacherUkrIconText}>📖</Text>
              </View>
              <View>
                <Text style={styles.teacherUkrTitle}>Українська мова</Text>
                <Text style={styles.teacherName}>Ірина Василівна Шевченко</Text>
              </View>
            </View>
            
            <View style={[styles.teacherCard, styles.teacherInf]}>
              <View style={[styles.teacherIconCircle, styles.teacherInfIcon]}>
                <Text style={styles.teacherInfIconText}>💻</Text>
              </View>
              <View>
                <Text style={styles.teacherInfTitle}>Інформатика</Text>
                <Text style={styles.teacherName}>Сергій Олександрович Бондар</Text>
              </View>
            </View>
          </View>
        </View>
         */}

  {/* <TouchableOpacity style={[styles.logoutBtn, gstyles.WidgetBack]}>
          <Text style={[styles.logoutText,{color:WidgetColorText}]}>Edit cards</Text>
        </TouchableOpacity> */}


  return (
    <ScrollView
      style={[
        styles.flex1,
        gstyles.back,
        {
          paddingVertical: Platform.OS === 'ios' || Platform.OS === 'android' ? 50 : 0,
        },
      ]}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
    >
      <Animated.View
        style={{
          opacity: anim,
          paddingBottom: 100,
          transform: [
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
          ],
        }}
      >
        <View style={styles.profileBlock}>
          <View style={styles.avatar}>
            <Image style={styles.avatarIcon} source={require("@emoji/Student.png")} />
          </View>
          <Text style={[styles.profileName, { color: ProfilText }]}>{Prof.entext[9]}</Text>
          <Text style={styles.profileInfo}>{` ${Prof.entext[25]} • ${Prof.entext[10]} `}</Text>
        </View>

        <View style={[styles.card, gstyles.WidgetBack]}>
          <Text style={[styles.cardTitle, { color: WidgetColorText }]}>Логін</Text>
          <View style={styles.row}>
            <Text style={[styles.cardTitle, { color: ProfilTextValue }]}>{login}</Text>
          </View>
        </View>


        <FullScreenModal
          close={false}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <Image
            source={require("../../assets/image/homyak.jpeg")}
            style={{ width: 300, height: 300, borderRadius: 15 }}
          />
          <View style={{ padding: 20 }}>
            <Text>Статус Service Worker:</Text>
            <Text>{swStatus}</Text>
          </View>
        </FullScreenModal>

        <View style={[styles.scoreBlock, gstyles.WidgetBack]}>
          <View style={[styles.scoreCircle, { backgroundColor: ProfilCircle }]}>
            <Text
              style={[
                { color: GlobalColor },
                styles.scoreText,
                Bal && Bal.toString().length > 4 ? styles.scoreTextSmall : styles.scoreTextLarge,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {Bal}
            </Text>
          </View>
          <View>
            <Text style={[styles.scoreTitle, { color: WidgetColorText }]}>Середній бал</Text>
            <Text style={styles.scoreSubtitle}>Ваша успішність зростає!</Text>
          </View>
        </View>


        <TouchableOpacity style={[styles.logoutBtn, gstyles.WidgetBack, { marginTop: 20 }]} onPress={update}>
          <Text style={[styles.OnlineText, { color: GlobalColor }]}>Оновити розклад</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.logoutBtn, gstyles.WidgetBack]} onPress={() => { navigation.navigate("Teachers") }}>
          <Text style={[styles.OnlineText, { color: GlobalColor }]}>Мої вчителі</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.logoutBtn, gstyles.WidgetBack, { marginTop: 40 }]} onPress={logout}>
          <Text style={styles.logoutText}>Вийти</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={Pazinich}>
          <Text style={styles.versionText}>{VERSION}</Text>
        </TouchableOpacity>

      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  scrollContent: { padding: 24 },
  profileBlock: { alignItems: 'center', paddingBottom: 32 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    elevation: 2,
  },
  avatarIcon: { width: 48, height: 48 },
  profileName: { fontSize: 26, fontWeight: '700' },
  profileInfo: { color: '#888', fontSize: 16 },
  card: {

    borderRadius: 18,
    padding: 22,
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    elevation: 2,
  },
  cardSection: { marginBottom: 16 },
  cardTitle: { fontSize: 18, marginBottom: 6, fontWeight: '500' },
  cardValue: { fontSize: 16, color: '#444', flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  link: { color: '#007aff', fontSize: 14, fontWeight: '500' },
  scoreBlock: {

    borderRadius: 18,
    padding: 22,
    marginBottom: 24,

    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    backgroundColor: '#f2f2f7',
    borderRadius: 50,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scoreText: { fontWeight: 'bold' },
  scoreTextLarge: { fontSize: 24 },
  scoreTextSmall: { fontSize: 19 },
  scoreTitle: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  scoreSubtitle: { color: '#888', fontSize: 15 },
  teachersBlock: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    marginBottom: 32,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    elevation: 2,
  },
  teachersTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: '700',
    color: '#007aff',
    letterSpacing: 0.5,
  },
  teachersList: { gap: 12 },
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#f2f2f7',
    marginBottom: 8,
  },
  teacherIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#e5e5ea',
  },
  teacherName: { color: '#444', fontSize: 15 },
  teacherMath: {},
  teacherMathIcon: {},
  teacherMathIconText: { fontSize: 20, color: '#007aff' },
  teacherMathTitle: { fontSize: 16, fontWeight: '600', color: '#007aff' },
  teacherUkr: {},
  teacherUkrIcon: {},
  teacherUkrIconText: { fontSize: 20, color: '#d81b60' },
  teacherUkrTitle: { fontSize: 16, fontWeight: '600', color: '#d81b60' },
  teacherInf: {},
  teacherInfIcon: {},
  teacherInfIconText: { fontSize: 20, color: '#388e3c' },
  teacherInfTitle: { fontSize: 16, fontWeight: '600', color: '#388e3c' },
  logoutBtn: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    elevation: 2,
    gap: 20
  },

  OnlineText: { fontSize: 16, fontWeight: '600' },
  VersionText: { fontSize: 16, fontWeight: '600' },
  logoutText: { color: '#d21919', fontSize: 16, fontWeight: '600' },


  versionText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',

    marginTop: 20,
  },
});