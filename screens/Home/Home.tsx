import { useEffect, useState, useRef, useCallback } from 'react';
import { Animated, ScrollView, StyleSheet, Platform, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
// Stores
import useLoadingStore from '@store/LoadStore';
import useBalStore from '@store/BalStore';
import useLesionStore from '@store/LesionStore';
import useHomeWorkStore from '@store/HomeWorkStore';
import useProfileStore from '@store/ProfileStore';
import UseErrorStore from '@store/Error';
import useMessageStore from '@store/MessageStore';
import useFetchStore from '@store/fetchStore';
import useDiaryStore from '@store/DiaryStore';

// Config and API
import { ISPROD } from 'config/config';
import { getData, storeData } from '@components/LocalStorage';
import { CheckToken } from '@api/CheckToken';
import { GetLesion } from '@api/GetLesion';
import { GetAllData } from '@api/GetAlldata';
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
import BottomAlert from '@screens/Message/components/BottomAlert';
import { useMessageSendStore } from '@store/SendMessageStore';
import useUrokStore from '@store/UrokStore';
import useDateStore from '@store/DateStore';






export default function Home() {
  const { gstyles } = Gstyle();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();
  const [LoadText, SetLoadText] = useState('Оновлюємо дані...');
  const [Loads, setLoads] = useState(true);
  const [Lesion, setLesionText] = useState('');
  const [mis, setMis] = useState<number | null>(null);
  const [Povidok, setPovidok] = useState<number | null>(null);
  const [cardAnim] = useState([
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ]);

  const [refresh, setrefresh] = useState(false);
  const setLoad = useLoadingStore(state => state.setLoad);
  const setLoadsd = useFetchStore(state => state.setLoads);
  const SetDiary = useDiaryStore(state => state.SetDiary);
  const Bal = useBalStore(state => state.bal);
  const setBal = useBalStore(state => state.setBal);
  const setProfile = useProfileStore(state => state.setProfile);
  const setMessage = useMessageStore(state => state.SetMessage);
  const setMessageSend = useMessageSendStore(state => state.setMessageSend);
  const setHomeWork = useHomeWorkStore(state => state.SetHomeWork);
  const {lesion,setLesions} = useLesionStore();
  const seterrors = UseErrorStore(state => state.setError);
  const setUrok = useUrokStore(state => state.SetUrok);
  const setDate = useDateStore(state => state.setDate);


  const applyData = async (MHDATA: any, haptic: boolean) => {
    SetLoadText('Застосовуємо дані...');
    const [HomePage, HomeWork, Lesions, Profile, Messages, MessagesSend] = MHDATA;
    setBal(HomePage[14]);
    setMis(HomePage[15]);
    setPovidok(HomePage[10]);
    setProfile(Profile);
    setMessage(Messages.value);
    setMessageSend(MessagesSend.value);
    setHomeWork(Array.isArray(HomeWork?.value) ? HomeWork.value : []);
    const lesionData = await GetLesion(Lesions, setUrok);
    setLesionText(lesionData);
    setLesions(Lesions);
    if (haptic) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };


  const loadAnim = useRef(new Animated.Value(Loads ? 1 : 0)).current;
  const [showLoad, setShowLoad] = useState<boolean>(Loads);



  useEffect(() => {
    if (Loads) {
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
  }, [Loads, loadAnim])

  const loadTranslateY = loadAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 0],
  });
  const loadOpacity = loadAnim;

  const checkAndApplyCache = async () => {
    const cached = await getData('check');
    const diary = await getData('diary');

    if (cached) {
      SetLoadText('Зчитуємо дані з кешу...');
      await applyData(JSON.parse(cached), false);
    }
    if (diary) {
      SetDiary(JSON.parse(diary));
    }
  };


  const validateSessionAndFetch = async (login: string, password: string) => {
    const tokens = await getData('tokens');
    if (!tokens) return;


    SetLoadText('Перевіряємо сесію...');
    const page = await CheckToken(tokens);
    if (!page.status) {
      SetLoadText('Оновлюємо сесію...');
      const data = await Logins(login, password);
      await storeData('tokens', JSON.stringify(data.tokens));
      return validateSessionAndFetch(login, password);
    }



    SetLoadText('Валідуємо сесію...');
    const data = await GetAllData(tokens, setDate);
    if (data) {
      data[0] = page.status;

      await applyData(data, true);
      setLoads(false);
      setLoadsd(true);

      setLoad(false);
      await storeData('check', JSON.stringify(data));
    }


  };

  const UpdateSchudle = async () => {
    const lesionData = await GetLesion(lesion, setUrok);
    setLesionText(lesionData);
  }

  useFocusEffect(
    useCallback(() => {
      UpdateSchudle()
      cardAnim.forEach((anim, i) => {
        anim.setValue(0);
        Animated.timing(anim, { toValue: 1, duration: 400 + i * 120, useNativeDriver: Platform.OS !== 'web' }).start();
      });

    }, [])
  );
  const fetchData = async (check: boolean) => {
    const login = await getData('login');
    const password = await getData('password');
    if (!login || !password) return;

    console.time("load")

    await Promise.all([
      check && checkAndApplyCache(),
      validateSessionAndFetch(login, password),
    ]);

    console.timeEnd("load")

  };

  const dwf = async () => {
    setLoads(true);
    setLoadsd(false);
    setLoad(true);
    await fetchData(false);
    setrefresh(false);
  }

  useEffect(() => {

    if (ISPROD) {
      fetch('https://67e479672ae442db76d48b54.mockapi.io/allert')
        .then(res => res.json())
        .then(data => {
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
            refreshing={refresh}
            onRefresh={() => dwf()}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {showLoad && (
          <Animated.View style={{ transform: [{ translateY: loadTranslateY }], opacity: loadOpacity }}>
            <LoadWidget text={LoadText} />
          </Animated.View>
        )}

        {menu.map((item, index) => (
          <Widget load={Loads} key={index} item={item} index={index} cardAnim={cardAnim} />
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,

    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
    marginLeft: 8,
  },
});
