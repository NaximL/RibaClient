import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import UseErrorStore from '@store/Error';
import { Gstyle } from '@styles/gstyles';

export default function Stop() {
  const { gstyles,ProfilText } = Gstyle();

  const navigation = useNavigation();
  const error = UseErrorStore((state) => state.errors);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>('Помилка');
  const [label, setLabel] = useState<string>('Будь ласка, спробуйте пізніше');

  const cardAnim = useRef(new Animated.Value(0)).current;

  const animateCard = useCallback(() => {
    cardAnim.setValue(0);
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [cardAnim]);

  useEffect(() => {
    setTitle(error.name || 'Помилка');
    setLabel(error.label || 'Будь ласка, спробуйте пізніше');
    setLoading(false);
    animateCard();
  }, [animateCard, error]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const cardOpacity = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <ScrollView
      contentContainerStyle={[styles.wrapper, gstyles.back]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          gstyles.WidgetBack,
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }],
          },
        ]}
      >
        <Image
          source={require("@emoji/Warning.png")}
          style={styles.icon}
        />
        <Text style={[styles.title,{color:ProfilText}]}>{title}</Text>
        <Text style={[styles.label,{color:ProfilText}]}>{label}</Text>
      </Animated.View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    
    textAlign: 'center',
  },
});