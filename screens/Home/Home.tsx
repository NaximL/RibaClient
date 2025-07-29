import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  ActivityIndicator,
  Platform
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
import { RootStackParamList } from '../../router/router';
import { useNavigation } from '@react-navigation/native';
import { ISPROD } from 'config/config';
import UseErrorStore from '@store/Error';
import useMessageStore from '@store/MessageStore';
import useFetchStore from '@store/fetchStore';

export default function Home() {
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();

  const load = useLoadingStore((state) => state.load);
  const setLoad = useLoadingStore((state) => state.setLoad);

  const Loadsd = useFetchStore((state) => state.loads);
  const setLoadsd = useFetchStore((state) => state.setLoads);

  const seterrors = UseErrorStore((state) => state.setError);

  const Bal = useBalStore((state) => state.bal);
  const setBal = useBalStore((state) => state.setBal);

  const setMessage = useMessageStore((state) => state.SetMessage);

  const setHomeWork = useHomeWorkStore((state) => state.SetHomeWork);

  const setLesions = useLesionStore((state) => state.setLesions);

  const setProfile = useProfileStore((state) => state.setProfile);




  const [Loads, setLoads] = useState(true)
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
    if (ISPROD) {
      fetch('https://67e479672ae442db76d48b54.mockapi.io/allert')
        .then(response => response.json())
        .then(data => {
          if (data[0]?.status === true) {
            seterrors(data[0])
            navigation.navigate('Stop');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
    }

    const fetchData = async () => {
      const login = await getData("login");
      const password = await getData("password");

      if (!login || !password) return;

      const applyData = async (MHDATA: any, triggerHaptics: boolean) => {
        if (!MHDATA) return;

        const [HomePage, HomeWork, Lesions, ProfilUser, Message] = MHDATA;

        setBal(HomePage[14]);
        setMis(HomePage[15]);
        setPovidok(HomePage[10]);
        setLesions(Lesions);
        setProfile(ProfilUser);
        setMessage(Message.value);

        setHomeWork(Array.isArray(HomeWork?.value) ? HomeWork.value : []);

        const lesionData = await GetLesion(Lesions);
        setLesion(lesionData);

        if (triggerHaptics) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      };


      const cachedData = await getData("check");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        applyData(parsed, false);
        setLoad(false);
      }


      if (!Loadsd) {
        await GetAllData(login, password).then(async (data) => {
          if (data) {
            await storeData("check", JSON.stringify(data));
            applyData(data, true);

            setLoads(false);
            setLoadsd(true);
            
            setLoad(false);

          }
        })

      }
      else {
        setLoads(false);
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
      "data": Povidok ?? '...',

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
    <>

      {Loads && <View style={styles.LargeLoad}><ActivityIndicator size="small" color="#007aff" /></View>}

      <ScrollView style={styles.wrapper} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        {menu.map((item, index) =>
          <Widget load={Loads} key={index} item={item} index={index} cardAnim={cardAnim} />
        )}
        <StatusBar style="auto" />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    paddingVertical: 50,
    paddingBottom: 100
  },
  LargeLoad: {
    position: "absolute",
    left: Platform.OS === 'ios' || Platform.OS === 'android' ? 20 : 10,
    top: Platform.OS === 'ios' || Platform.OS === 'android' ? 25 : 10,
    zIndex: 1000,
  }
});