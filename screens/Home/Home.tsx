import { useEffect, useState, useRef, useCallback } from 'react';
import { View, Animated, ScrollView, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

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
import { GetToken } from '../../api/MH_APP/GetToken';
import { ValidToken } from '../../api/MH_APP/ValidToken';
import { RefreshToken } from '../../api/MH_APP/RefreshToken';
import { GetDiary } from '../../api/MH_APP/GetDiary';

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

  const [alerts, setalerts] = useState(false);
  const [TextAlert, setTextAlert] = useState('');
  const setLoad = useLoadingStore(state => state.setLoad);
  const load = useLoadingStore(state => state.load);
  const setLoadsd = useFetchStore(state => state.setLoads);
  const SetDiary = useDiaryStore(state => state.SetDiary);
  const Bal = useBalStore(state => state.bal);
  const setBal = useBalStore(state => state.setBal);
  const setProfile = useProfileStore(state => state.setProfile);
  const setMessage = useMessageStore(state => state.SetMessage);
  const setMessageSend = useMessageSendStore(state => state.setMessageSend);
  const setHomeWork = useHomeWorkStore(state => state.SetHomeWork);
  const setLesions = useLesionStore(state => state.setLesions);
  const seterrors = UseErrorStore(state => state.setError);

  const applyData = async (MHDATA: any, haptic: boolean) => {
    SetLoadText('Застосовуємо дані...');
    const [HomePage, HomeWork, Lesions, Profile, Messages,MessagesSend] = MHDATA;
    setBal(HomePage[14]);
    setMis(HomePage[15]);
    setPovidok(HomePage[10]);
    setProfile(Profile);
    setMessage(Messages.value);
    setMessageSend(MessagesSend.value);
    setHomeWork(Array.isArray(HomeWork?.value) ? HomeWork.value : []);
    const lesionData = await GetLesion(Lesions);
    setLesionText(lesionData);
    setLesions(Lesions);
    if (haptic) await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const applytokendata = async (token: string, studentId: string) => {
    const date = new Date();
    const mm: number = date.getMonth() + 1
    const diary = await GetDiary(token, studentId, mm, 100);
    await storeData('diary', JSON.stringify(diary));
    SetDiary(diary);
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

  const handleTokenLogic = async (login: string, password: string) => {

    const tokensRaw = await getData('token_app');

    if (!tokensRaw) {
      SetLoadText('Отримуємо токен...');
      const data = await GetToken(login, password);
      if (!data) {
        setTextAlert("Помилка завантаження даних");
        setalerts(true)
        seterrors({ name: 'token error', status: true, label: 'Не вдалось отримати токени' });
        navigation.navigate('Stop');
        return;
      }
      await storeData('token_app', JSON.stringify(data));
    } else {
      const token = JSON.parse(tokensRaw);
      SetLoadText('Перевіряємо токен...');
      const valid = await ValidToken(token);

      if (!valid) {
        const newTokens = await RefreshToken(token);
        if (newTokens === true) {
          SetLoadText('Оновлюємо токен...');
          applytokendata(newTokens, valid.enrollments[0].studentId)
          await storeData('token_app', JSON.stringify(newTokens));
        }
        else if (newTokens === false) {
          SetLoadText('Оновлюємо токени...');
          const data = await GetToken(login, password);
          if (!data) {
            setTextAlert("Помилка завантаження даних");
            setalerts(true);
            seterrors({ name: 'token error', status: true, label: 'Не вдалось отримати токени' });
            navigation.navigate('Stop');
            return;
          }
          await storeData('token_app', JSON.stringify(data));
          applytokendata(data, valid.enrollments[0].studentId)
        }
      } else {
        SetLoadText('Верифікуємо токен...');
        applytokendata(token, valid.enrollments[0].studentId)
      }

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
    const data = await GetAllData(tokens);
    if (data) {
      data[0] = page.status;

      await applyData(data, true);
      setLoads(false);
      setLoadsd(true);

      setLoad(false);
      await storeData('check', JSON.stringify(data));
    }

  };

  useFocusEffect(
    useCallback(() => {
      cardAnim.forEach((anim, i) => {
        anim.setValue(0);
        Animated.timing(anim, { toValue: 1, duration: 400 + i * 120, useNativeDriver: Platform.OS !== 'web' }).start();
      });
    }, [])
  );

  useEffect(() => {
    if (ISPROD) {
      fetch('https://67e479672ae442db76d48b54.mockapi.io/allert')
        .then(res => res.json())
        .then(data => {
          if (data[0]?.status) {
            seterrors(data[0]); navigation.navigate('Stop')
          }
        })
        .catch(err => console.error('Mock API error:', err));
    }

    const fetchData = async () => {
      const login = await getData('login');
      const password = await getData('password');
      if (!login || !password) return;

      console.time("load")
      await Promise.all([
        checkAndApplyCache(),
        validateSessionAndFetch(login, password),
        handleTokenLogic(login, password),
      ]);
      console.timeEnd("load")

    };
    fetchData();
  }, []);

  const menu = [
    { image: BooksEmoji, lable: 'Урок зараз', data: Lesion || '...' },
    { image: MailEmoji, lable: 'Повідомлення', data: Povidok || '...' },
    { image: AnalitikEmoji, lable: 'Середній бал', data: Bal || '...', source: "Diary" },
    { image: MedalEmoji, lable: 'Місце в класі', data: mis ? `${mis} з 32` : '...' },
  ];

  if (load) {
    return <View style={[gstyles.back, styles.center]}><ActivityIndicator size="large" color="#007aff" /></View>;
  }


  return (


    <ScrollView style={[styles.wrapper, gstyles.back]} contentContainerStyle={styles.container} >
      {showLoad && (
        <Animated.View style={{ transform: [{ translateY: loadTranslateY }], opacity: loadOpacity }}>
          <LoadWidget text={LoadText} />
        </Animated.View>
      )
      }

      {
        menu.map((item, index) => (
          <Widget load={Loads} key={index} item={item} index={index} cardAnim={cardAnim} />
        ))
      }
      <StatusBar style="auto" />

      <BottomAlert
        visible={alerts}
        onHide={() => { }}
        text={TextAlert} />

    </ScrollView >

  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingVertical: 50, paddingBottom: 100 },
  container: { alignItems: 'center', justifyContent: 'center' },
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
