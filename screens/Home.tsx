import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Animated, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { login } from '../api/MH/login';
import useLoadingStore from '../store/LoadStore';
import { GetLesion } from '../api/MH/GetLesion';
import { getData, removeData, storeData } from '../components/LocalStorage';
import useBalStore from '../store/BalStore';
import useLesionStore from '../store/LesionStore';
import { GetHomeWork } from '../api/MH/GetHomeWork';
import useHomeWorkStore from '../store/HomeWorkStore';
import useProfileStore from '../store/ProfileStore';
import { GetProfil } from '../api/MH/GetProfil';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { GetAllData } from '../api/MH/GetAlldata';

export default function Home() {
  const load = useLoadingStore((state) => state.load);
  const setLoad = useLoadingStore((state) => state.setLoad);


  const Bal = useBalStore((state) => state.bal);
  const setBal = useBalStore((state) => state.setBal);

  const setHomeWork = useHomeWorkStore((state) => state.SetHomeWork);

  const setLesions = useLesionStore((state) => state.setLesions);

  const setProfile = useProfileStore((state) => state.setProfile);

  const [Menu, setMenu] = useState<Array<any> | []>([]);




  const [Lesion, setLesion] = useState<string | ''>("");
  const [mis, setMis] = useState<number | null>(null);
  const [Sta, SetSta] = useState<boolean | false>(true);
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

          setLoad(!load);
        });

        // GetLesion(logins, password, true).then((data) => {
        //   setLesion(data)
        // })
        // GetLesion(logins, password, false).then((data) => {
        //   setLesions(data)
        // })


        // GetProfil(logins, password).then((data) => {
        //   console.log(data);
        //   setProfile(data)
        // })

      }
    };
    fetchData();

    if (getData('menu') === null) {
      storeData('menu', JSON.stringify([
        {
          "lable": "📚 Урок зараз",
          "data": Lesion ?? '...'
        }]
      ))

    }

  }, []);

  const menu = [

    {
      "image": require('../assets/emoji/Books.png'),
      "lable": "Урок зараз",
      "data": Lesion ?? '...'
    },
    {
      "image": require('../assets/emoji/Mail.png'),
      "lable": "Повідомлення",
      "data": Povidok ?? '...'
    },
    {
      "image": require('../assets/emoji/Analitik.png'),
      "lable": "Середній бал",
      "data": Bal ?? '...'
    },
    {
      "image": require('../assets/emoji/Medal.png'),
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
      {menu.map((item, index) => (
        <Animated.View
          key={index}
          style={[
            styles.card,
            {
              opacity: cardAnim[index],
              transform: [
                { scale: cardAnim[index].interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                { translateY: cardAnim[index].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }
              ]
            }
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ width: '100%', alignItems: 'center' }}
            onPress={() => {

            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              {item.image && (
                <Image
                  source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.label}>{item.lable}</Text>
            </View>
            <Text style={styles.value}>{item.data}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
      <StatusBar style="dark" />
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    paddingVertical: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginVertical: 14,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 8,
  },
  label: {
    fontSize: 20,
    color: '#888',

    fontWeight: '500',
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 0.5,
  },
  body: {
    display: 'flex',
  }
});