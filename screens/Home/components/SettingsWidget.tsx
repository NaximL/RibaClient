import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../router/router';
import { Gstyle } from '@styles/gstyles';
import GearEmoji from '@emoji/Gear.png';

type SettingsWidgetProps = {
  index: number;
  cardAnim: Animated.Value[];
  load?: boolean;
};

const SettingsWidget: React.FC<SettingsWidgetProps> = ({ index, cardAnim, load = false }) => {
  const { gstyles, WidgetColorText } = Gstyle();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const scale = cardAnim[index].interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });
  const translateY = cardAnim[index].interpolate({ inputRange: [0, 1], outputRange: [30, 0] });

  const handlePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <Animated.View
      style={[
        styles.card,
        gstyles.WidgetBack,
        {
          transform: [{ scale }, { translateY }],
          opacity: cardAnim[index],
        }
      ]}
      shouldRasterizeIOS
      renderToHardwareTextureAndroid
    >
      <TouchableOpacity
        style={{ width: '100%', alignItems: 'center' }}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <View style={styles.row}>
          <Image source={GearEmoji} style={styles.icon} resizeMode="contain" />
          <Text style={[styles.label, { color: load ? '#888' : WidgetColorText }]}>
            Налаштування
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SettingsWidget;

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 28,
    marginVertical: 14,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
  },
});