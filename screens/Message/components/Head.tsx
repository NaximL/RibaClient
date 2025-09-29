import React, { useRef, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Gstyle } from 'styles/gstyles';
import { getData } from '@components/LocalStorage';
import { fetchData } from '@api/GetAlldata';
import useMessageStore from '@store/MessageStore';
import { useMessageSendStore } from '@store/SendMessageStore';

type Props = {
  setActiveMod: (mod: number) => void;
  ActiveMod: number; onPress: () => void;
  SetLoad: (Load: boolean) => void;
}

const Head = ({ setActiveMod, ActiveMod, onPress, SetLoad }: Props) => {
  const { isDark, MessageBubleActive, MessageBubleText, MessageBubleTextActive, MessageBuble } = Gstyle();
  const { SetMessage } = useMessageStore();
  const { setMessageSend } = useMessageSendStore();

  const width = useMemo(() => {
    if (Platform.OS === "android") {
      return 100;
    } else {
      return 110;
    }
  }, []);


  const FontSize = useMemo(() => {
    if (Platform.OS === "android") {
      return 14;
    } else {
      return 15;
    }
  }, []);



  const translateX = useRef(new Animated.Value(ActiveMod * width)).current;

  const setActive = async (mod: number) => {
    const tokens = await getData("tokens");
    if (!tokens) return

    if (mod === 0) {
      SetLoad(true)
      const messages = await fetchData("message", tokens);
      SetMessage(messages.value)
      SetLoad(false)
    }
    else {
      SetLoad(true)
      const messages = await fetchData("messagesendmes", tokens);
      setMessageSend(messages.value)
      SetLoad(false)
    }

    setActiveMod(mod);
    Animated.spring(translateX, {
      toValue: mod * width,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  };

  return (
    <View
      style={styles.container}
    >

      <BlurView
        intensity={40}
        style={StyleSheet.absoluteFill}
        tint={isDark ? "dark" : 'light'}
      />
      <View style={[styles.bubblesWrapper, { backgroundColor: MessageBuble }]}>
        <Animated.View
          style={[
            styles.activeBg,
            { backgroundColor: MessageBubleActive, transform: [{ translateX: translateX }], width: width },
          ]}
        />

        <TouchableOpacity onPress={() => setActive(0)} style={[styles.bubble, { width: width }]}>
          <Text style={[styles.bubbleText, { fontSize: FontSize, color: ActiveMod === 0 ? MessageBubleTextActive : MessageBubleText }]}>
            Вхідні
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActive(1)} style={[styles.bubble, { width: width }]}>
          <Text style={[styles.bubbleText, { fontSize: FontSize, color: ActiveMod === 1 ? MessageBubleTextActive : MessageBubleText }]}>
            Відправлені
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onPress} style={styles.createBtn}>
        <Ionicons name="create-outline" size={18} color={MessageBubleTextActive} />
        <Text style={[styles.bubbleText, { fontSize: FontSize, color: MessageBubleTextActive, marginLeft: 6 }]}>
          Створити
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Head;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === "ios" || Platform.OS === "android" ? 50 : 10,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 99,
  },
  bubblesWrapper: {


    flexDirection: 'row',
    position: 'relative',

    borderRadius: 20,
    overflow: 'hidden',
  },
  bubble: {

    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  bubbleText: {
    fontSize: 15,
    fontWeight: '500',
  },
  activeBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    borderRadius: 20,
    zIndex: 0,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  createBtn: {

    backgroundColor: 'rgb(0,122,255)',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});