import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useEffect, useState, useRef, useCallback } from 'react';



import useLoadingStore from '@store/LoadStore';
import useBalStore from '@store/BalStore';
import useLesionStore from '@store/LesionStore';
import useHomeWorkStore from '@store/HomeWorkStore';
import useProfileStore from '@store/ProfileStore';
import UseErrorStore from '@store/Error';
import useMessageStore from '@store/MessageStore';
import useFetchStore from '@store/fetchStore';

import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


import BooksEmoji from '@emoji/Books.png';
import MailEmoji from '@emoji/Mail.png';
import AnalitikEmoji from '@emoji/Analitik.png';
import MedalEmoji from '@emoji/Medal.png';

import Widget from './components/Widget';
import LoadWidget from './components/LoadWidget';
import { Gstyle } from 'styles/gstyles';
import { ISPROD } from 'config/config';
import { RootStackParamList } from '../../router/router';
import { getData, storeData } from '@components/LocalStorage';


import { CheckToken } from '@api/CheckToken';
import { GetLesion } from '@api/GetLesion';
import { GetAllData } from '@api/GetAlldata';
import { Logins } from '@api/Login';


export default function Home() {

  const { gstyles } = Gstyle();

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


        setProfile(ProfilUser);

        setMessage(Message.value);
        setHomeWork(Array.isArray(HomeWork?.value) ? HomeWork.value : []);


        const lesionData = await GetLesion(Lesions);
        setLesion(lesionData);
        setLesions(Lesions);

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

      const ChangeData = async (token: string, page: string) => {
        await GetAllData(token).then(async (data) => {
          if (data) {
            let th = data;
            th[0] = page;
            console.log(th)

            await storeData("check", JSON.stringify(th));
            applyData(th, true);

            setLoads(false);
            setLoadsd(true);
            setLoad(false);

          }
        })
      }

      if (!Loadsd) {

        const tokens = await getData("tokens");
        if (!tokens) return

        const CheckTok = async (attempt = 0) => {
          if (attempt > 3) {
            console.error("Забагато спроб перевірки токену.");
            return;
          }

          await CheckToken(tokens).then(async page => {
            if (!page.status) {
              await Logins(login, password).then(async data => {
                await storeData("tokens", JSON.stringify(data.tokens));
                await CheckTok(attempt + 1);
              });
            } else {
              const tokens = await getData("tokens");
              if (!tokens) return
              ChangeData(tokens, page.status);
            }
          }).catch(e => console.error("Помилка перевірки токену:", e));
        };

        CheckTok();

      }
      else {
        setLoads(false);
      }

    }
    fetchData();


  }, []);




  const menu = [

    {
      "image": BooksEmoji,
      "lable": "Урок зараз",
      "data": Lesion ?? '...'
    },
    {
      "image": MailEmoji,
      "lable": "Повідомлення",
      "data": Povidok ?? '...',

    },
    {
      "image": AnalitikEmoji,
      "lable": "Середній бал",
      "data": Bal ?? '...'
    },
    {
      "image": MedalEmoji,
      "lable": "Місце в класі",
      "data": mis ? `${mis} з 32` : '...'
    }
  ]


  if (load) {
    return (
      <View style={[gstyles.back, { flex: 1, justifyContent: 'center', alignItems: 'center', }]}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <>

      <ScrollView style={[gstyles.back, styles.wrapper]} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>

        {Loads && <LoadWidget />}

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
    paddingVertical: 50,
    paddingBottom: 100
  }
});