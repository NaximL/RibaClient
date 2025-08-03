import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { Gstyle } from 'styles/gstyles';

const LoadWidget = () => {
    const { gstyles, LoginText } = Gstyle();

    return (
        <View style={[gstyles.LoadingBack, styles.LargeLoad]}>
            <ActivityIndicator size="small" color="#007aff" />
            <Text style={[styles.LargeLoadText, { color: LoginText }]} >Оновлення…</Text>
        </View>
    );
}

export default LoadWidget;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingVertical: 50,
    paddingBottom: 100
  },
  LargeLoad: {
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    borderRadius: 10,
    fontSize: 16,
    flex: 1,
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