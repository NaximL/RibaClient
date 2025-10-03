import { BlurView } from 'expo-blur';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Gstyle } from '@styles/gstyles';

const LoadWidget = ({ text = "Оновлення…", independent = false }: { text?: string, independent: boolean }) => {
  const { gstyles, LoginText, isDark } = Gstyle();
  return (
    <>
      {independent ?
        <BlurView intensity={60} tint={isDark ? "dark" : "light"} style={[gstyles.LoadingBack, styles.LargeLoad]}>
          < ActivityIndicator size="small" color="#007aff" />
          <Text style={[styles.LargeLoadText, { color: LoginText }]} >{text}</Text>
        </BlurView >
        :
        <View style={[gstyles.LoadingBack, styles.LargeLoad]}>
          <ActivityIndicator size="small" color="#007aff" />
          <Text style={[styles.LargeLoadText, { color: LoginText }]} >{text}</Text>
        </View>
      }
    </>
  );
}

export default LoadWidget;

const styles = StyleSheet.create({
  LargeLoad: {
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    borderRadius: 10,
    fontSize: 16,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 1000,
    marginBottom: 20,
  },
  LargeLoadText: {
    fontSize: 16,
    fontWeight: '500',
  }
});