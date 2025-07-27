import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableOpacity,
  ImageSourcePropType
} from 'react-native';
import { RootStackParamList } from '../../../router/router';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type Item = {
  image: ImageSourcePropType;
  lable: string;
  data: string | number;
  source?: string;
};

type WidgetProps = {
  item: Item;
  index: number;
  cardAnim: Array<Animated.Value>;
  load:boolean
};

const Widget: React.FC<WidgetProps> = ({ item, index, cardAnim ,load}) => {
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
  const navigation = useNavigation<NavigationProp>();

  return (
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
          if (item.source && typeof item.source === 'string') {
            navigation.replace(item.source as any);
          }
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
        <Text style={[styles.value,{ color: load ? '#888' : '#222' }]}>{item.data}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default Widget;


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginVertical: 14,
    width: '90%',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
  }
});