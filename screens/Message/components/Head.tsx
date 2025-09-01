import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Gstyle } from 'styles/gstyles';

const Head = ({ setActiveMod, ActiveMod,onPress }: any) => {
  const { isDark, MessageBubleActive, MessageBubleText, MessageBubleTextActive ,MessageBuble} = Gstyle();

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: ActiveMod * 110,
      useNativeDriver: Platform.OS !== "web" ,
      damping: 15,
      stiffness: 150,
    }).start();
  }, [ActiveMod]);

  return (
    <BlurView
      intensity={40}
      tint={isDark ? 'dark' : 'light'}
      style={styles.container}
    >
      <View style={[styles.bubblesWrapper,{backgroundColor:MessageBuble}]}>
        <Animated.View
          style={[
            styles.activeBg,
            { backgroundColor: MessageBubleActive, transform: [{ translateX }] },
          ]}
        />

        <TouchableOpacity onPress={() => setActiveMod(0)} style={styles.bubble}>
          <Text style={[styles.bubbleText, { color: ActiveMod === 0 ? MessageBubleTextActive : MessageBubleText }]}>
            Вхідні
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveMod(1)} style={styles.bubble}>
          <Text style={[styles.bubbleText, { color: ActiveMod === 1 ? MessageBubleTextActive : MessageBubleText }]}>
            Відправлені
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onPress} style={styles.createBtn}>
        <Ionicons name="create-outline" size={18} color={MessageBubleTextActive} />
        <Text style={[styles.bubbleText, { color: MessageBubleTextActive, marginLeft: 6 }]}>
          Створити
        </Text>
      </TouchableOpacity>
    </BlurView>
  );
};

export default Head;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 10,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 99,
  },
  bubblesWrapper: {
    marginLeft:5,

    flexDirection: 'row',
    position: 'relative',
    
    borderRadius: 20,
    overflow: 'hidden',
  },
  bubble: {
    width: 110,
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
    width: 110,
    height: '100%',
    borderRadius: 20,
    zIndex: 0,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  createBtn: {
    marginRight:5,
    backgroundColor: 'rgb(0,122,255)',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});