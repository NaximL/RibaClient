import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import UseErrorStore from '@store/Error';

export default function Stop() {
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
      useNativeDriver: true,
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
      contentContainerStyle={styles.wrapper}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
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
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    backgroundColor: '#f7f7fa',
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
    backgroundColor: '#fff',
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
    width:50,
    height:50,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});