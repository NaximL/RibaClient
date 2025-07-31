import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Platform, Image } from 'react-native'
import useBalStore from '../store/BalStore';
import useProfileStore from '../store/ProfileStore';
import { getData, removeData } from '../components/LocalStorage';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../router/router';
import { VERSION } from '../config/config';
import { Gstyle } from 'styles/gstyles';



export default function Profile() {
  const { gstyles, ProfilText, WidgetColorText, ProfilTextValue , ProfilCircle} = Gstyle();

  type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
  const Profile = useProfileStore((state) => state.Prof);
  const Bal = useBalStore((state) => state.bal);
  const navigation = useNavigation<NavigationProp>();
  const [login, setLogin] = React.useState<string | null>(null);
  const [anim] = React.useState(new Animated.Value(0));

  useFocusEffect(
    useCallback(() => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();


    }, [])
  );


  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    getData('login').then(setLogin);
  }, []);
  const logout = async () => {
    await removeData('login');
    navigation.replace('Login');
  };

  return (
    <ScrollView
      style={[
        styles.flex1,
        gstyles.back,
        {
          
          paddingVertical: Platform.OS === 'ios' ? 50 : 0,
        },
      ]}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
    >
      <Animated.View
        style={{
          opacity: anim,
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
          <Text style={[styles.profileName, { color: ProfilText }]}>{Profile.entext[9]}</Text>
          <Text style={styles.profileInfo}>{` ${Profile.entext[25]} • ${Profile.entext[10]} `}</Text>
        </View>
        <View style={[styles.card, gstyles.WidgetBack]}>
          <View style={styles.cardSection}>
            <Text style={[styles.cardTitle, { color: WidgetColorText }]}>Логін</Text>
            <View style={styles.row}>
              <Text style={[styles.cardTitle, { color: ProfilTextValue }]}>{login}</Text>

            </View>
          </View>
          <View>
            <Text style={[styles.cardTitle, { color: ProfilTextValue }]}>{ }</Text>
            <View style={styles.row}>
              <Text style={styles.cardValue}>********</Text>

            </View>
          </View>
        </View>

        <View style={[styles.scoreBlock, gstyles.WidgetBack]}>
          <View style={[styles.scoreCircle,{backgroundColor: ProfilCircle}]}>
            <Text
              style={[
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
            <Text style={[styles.scoreTitle,{color: WidgetColorText}]}>Середній бал</Text>
            <Text style={styles.scoreSubtitle}>Ваша успішність зростає!</Text>
          </View>
        </View>

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


        <TouchableOpacity style={[styles.logoutBtn,gstyles.WidgetBack]} onPress={logout}>
          <Text style={styles.logoutText}>Вийти</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>{VERSION}</Text>

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
  scoreText: { color: '#007aff', fontWeight: 'bold' },
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
  },
  versionText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',

    marginTop: 20,
  },
  logoutText: { color: '#d21919', fontSize: 16, fontWeight: '600' },
});