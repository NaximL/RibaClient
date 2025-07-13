import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';
import useLoadingStore from '@store/LoadStore';
import useBalStore from '@store/BalStore';
import useLesionStore from '@store/LesionStore';
import useHomeWorkStore from '@store/HomeWorkStore';
import useProfileStore from '@store/ProfileStore';
import { useEffect, useState, useRef, useCallback } from 'react';
import { GetLesion } from '@api/GetLesion';
import { GetAllData } from '@api/GetAlldata';
import { getData, storeData } from '@components/LocalStorage';
import Widget from './components/Widget';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../router';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();

  const load = useLoadingStore((state) => state.load);
  const setLoad = useLoadingStore((state) => state.setLoad);


  const Bal = useBalStore((state) => state.bal);
  const setBal = useBalStore((state) => state.setBal);

  const setHomeWork = useHomeWorkStore((state) => state.SetHomeWork);

  const setLesions = useLesionStore((state) => state.setLesions);

  const setProfile = useProfileStore((state) => state.setProfile);






  const [Lesion, setLesion] = useState<string | ''>("");
  const [mis, setMis] = useState<number | null>(null);

  const [Povidok, setPovidok] = useState<number | null>(null)

  const [cardAnim] = useState([
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current
  ]);

  useFocusEffect(
    useCallback(() => {
      cardAnim.forEach((anim, i) => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 400 + i * 120,
          useNativeDriver: true,
        }).start();
      });
    }, [])
  );

  useEffect(() => {
    if (!load) {
      cardAnim.forEach((anim, i) => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 400 + i * 120,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [load]);

  useEffect(() => {

    fetch('https://67e479672ae442db76d48b54.mockapi.io/allert')
      .then(response => response.json())
      .then(data => {
        if (data[0]?.status === true) {
          navigation.replace('Login');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })



    const fetchData = async () => {
      const logins: string | null = await getData("login");
      const password: string | null = await getData("password");
      if (logins !== null && password !== null) {

        GetAllData(logins, password).then((MHDATA) => {

          const HomePage = MHDATA[0];
          const HomeWork = MHDATA[1];
          const Lesions = MHDATA[2];
          const ProfilUser = MHDATA[3];

          setBal(HomePage[14]);
          setMis(HomePage[15]);
          setPovidok(HomePage[10]);
          setLesions(Lesions)
          setProfile(ProfilUser)

          if (HomeWork && Array.isArray(HomeWork.value)) {
            setHomeWork(HomeWork.value);
          } else {
            setHomeWork([]);
          }

          GetLesion(Lesions).then((data) => {
            setLesion(data)
          })
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          )
          setLoad(!load);
        });

      }
    };
    fetchData();


  }, []);




  const menu = [

    {
      "image": require('@emoji/Books.png'),
      "lable": "Урок зараз",
      "data": Lesion ?? '...'
    },
    {
      "image": require('@emoji/Mail.png'),
      "lable": "Повідомлення",
      "data": Povidok ?? '...'
    },
    {
      "image": require('@emoji/Analitik.png'),
      "lable": "Середній бал",
      "data": Bal ?? '...'
    },
    {
      "image": require('@emoji/Medal.png'),
      "lable": "Місце в класі",
      "data": mis ? `${mis} з 32` : '...'
    }
  ]
  if (load) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7fa' }}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
      {menu.map((item, index) =>
        <Widget key={index} item={item} index={index} cardAnim={cardAnim} />
      )}
      <StatusBar style="auto" />
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    paddingVertical: 50,
    paddingBottom: 100
  }
});