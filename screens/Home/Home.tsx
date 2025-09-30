import { useEffect, useState, useRef, useCallback } from 'react';
import { Animated, ScrollView, StyleSheet, Platform, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

// Stores
import useLoadingStore from '@store/LoadStore';
import useLesionStore from '@store/LesionStore';
import UseErrorStore from '@store/Error';

// Config and API
import { ISPROD } from 'config/config';
import { getData, storeData } from '@components/LocalStorage';
import { CheckToken } from '@api/CheckToken';
import { GetLesion } from '@api/GetLesion';
import { Logins } from '@api/Login';

// UI
import BooksEmoji from '@emoji/Books.png';
import MailEmoji from '@emoji/Mail.png';
import AnalitikEmoji from '@emoji/Analitik.png';
import MedalEmoji from '@emoji/Medal.png';
import Widget from './components/Widget';
import LoadWidget from './components/LoadWidget';
import { Gstyle } from 'styles/gstyles';
import { RootStackParamList } from '../../router/router';
import useUrokStore from '@store/UrokStore';
import useProfileStore from '@store/ProfileStore';
import Baner from './components/Baner';


type ApplyDataType = {
  HomePage: Array<any>,
  Schedule: Array<any>,
  Haptic: boolean
}



export default function Home() {
  const { gstyles } = Gstyle();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();
  const [LoadText, SetLoadText] = useState('Оновлюємо дані...');


  const [WidgetLoad, setWidgetLoad] = useState(true);
  const { setLoad } = useLoadingStore()


  const [BanerText, setBanerText] = useState('орєщькі бігбоб');
  const [BanerVis, setBanerVis] = useState(false);



  const { setProfile } = useProfileStore();
  const [Lesion, setLesionText] = useState('');
  const [mis, setMis] = useState<number | null>(null);
  const [Povidok, setPovidok] = useState<number | null>(null);

  const [cardAnim] = useState([
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ]);

  const [Refresh, setRefresh] = useState(false);






  const [Bal, SetBal] = useState<string>("0.00")

  const { lesion, setLesions } = useLesionStore();
  const seterrors = UseErrorStore(state => state.setError);
  const setUrok = useUrokStore(state => state.SetUrok);




  const loadAnim = useRef(new Animated.Value(WidgetLoad ? 1 : 0)).current;
  const [showLoad, setShowLoad] = useState<boolean>(WidgetLoad);

  useEffect(() => {
    if (WidgetLoad) {
      setShowLoad(true);
      Animated.timing(loadAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {

      Animated.timing(loadAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: Platform.OS !== 'web',
      }).start(({ finished }) => {
        if (finished) setShowLoad(false);
      });
    }
  }, [WidgetLoad, loadAnim])

  const loadTranslateY = loadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 0],
  });
  const loadOpacity = loadAnim;

  const UpdateSchudle = async (Sch?: Array<any>, u?: boolean) => {
    if (u) {
      const schedule: any = await getData("schedule");
      if (!schedule) return;
      const lesionData = await GetLesion(JSON.parse(schedule), setUrok);
      setLesionText(lesionData);
    }
    else {
      if (Sch) {
        const lesionData = await GetLesion(Sch, setUrok);
        setLesionText(lesionData);
      }
    }
  }


  useFocusEffect(
    useCallback(() => {

      UpdateSchudle([], true)
      cardAnim.forEach((anim, i) => {
        anim.setValue(0);
        Animated.timing(anim, { toValue: 1, duration: 400 + i * 120, useNativeDriver: Platform.OS !== 'web' }).start();
      });

    }, [])
  );


  const applyData = async ({ HomePage, Schedule, Haptic }: ApplyDataType) => {
    SetLoadText('Застосовуємо дані...');
    setLesions(Schedule);
    SetBal(HomePage[14]);
    setMis(HomePage[15]);
    setPovidok(HomePage[10]);
    UpdateSchudle(Schedule, false)
    if (Haptic) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const ApplyCash = async () => {
    SetLoadText('Зчитуємо дані з кешу...');
    const HomePage = await getData('homepage');
    const Schedule = await getData('schedule');
    const Profile = await getData('profile');
    Profile && setProfile(JSON.parse(Profile))
    if (!Schedule || !HomePage) return;
    await applyData({
      HomePage: JSON.parse(HomePage),
      Schedule: JSON.parse(Schedule),
      Haptic: false
    });
  };

  const ApplyServerData = async (login: string, password: string) => {
    SetLoadText('Перевіряємо сесію...');
    const tokens = await getData('tokens');
    if (!tokens) return;

    const page = await CheckToken(tokens);

    if (!page.status) {
      SetLoadText('Оновлюємо сесію...');
      const data = await Logins(login, password);
      await storeData('tokens', JSON.stringify(data.tokens));
      return ApplyServerData(login, password);
    }


    await storeData("homepage", JSON.stringify(page.status))

    SetLoadText('Валідуємо сесію...');
    const Schedule = await getData('schedule');

    if (!Schedule) return;

    await applyData({
      HomePage: page.status,
      Schedule: JSON.parse(Schedule),
      Haptic: true
    });

    setWidgetLoad(false);

    setLoad(false);
  };

  const fetchData = async (cash: boolean) => {
    const login = await getData('login');
    const password = await getData('password');
    if (!login || !password) return;

    console.time("load")

    await Promise.all([
      cash && ApplyCash(),
      ApplyServerData(login, password),
    ]);

    console.timeEnd("load")

  };

  const RefreshData = async () => {
    setWidgetLoad(true);

    setLoad(true);
    await fetchData(false);
    setRefresh(false);
  }

  useEffect(() => {
    if (ISPROD) {
      fetch('https://67e479672ae442db76d48b54.mockapi.io/allert')
        .then(res => res.json())
        .then(data => {
          setBanerVis(data[0]?.baner_status)
          setBanerText(data[0]?.baner_text)
          if (data[0]?.status) {
            seterrors(data[0]);
            navigation.replace('Stop')
          }
        })
        .catch(err => console.error('Mock API error:', err));
    }
    fetchData(true);
  }, []);

  const menu = [
    { image: BooksEmoji, lable: 'Урок зараз', data: Lesion || '...' },
    { image: MailEmoji, lable: 'Повідомлення', data: Povidok || '...' },
    { image: AnalitikEmoji, lable: 'Середній бал', data: Bal || '...', source: "Diary" },
    { image: MedalEmoji, lable: 'Місце в класі', data: mis ? `${mis} з 32` : '...' },

  ];


  return (
    <SafeAreaView style={[{ flex: 1 }, gstyles.back]}>
      <ScrollView
        style={[styles.wrapper, gstyles.back]}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={Refresh}
            onRefresh={() => RefreshData()}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {showLoad && (
          <Animated.View style={{ transform: [{ translateY: loadTranslateY }], opacity: loadOpacity }}>
            <LoadWidget independent={false} text={LoadText} />
          </Animated.View>
        )}

        <Baner status={BanerVis} text={BanerText} />

        {menu.map((item, index) => (
          <Widget load={WidgetLoad} key={index} item={item} index={index} cardAnim={cardAnim} />
        ))}

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    alignItems: 'center',
    paddingBottom: Platform.OS === "android" ? 200 : 100,
  },
});
