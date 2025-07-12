
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';



const Header: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: Platform.OS === 'ios' ? Math.min(insets.top, 0) : 0,
          paddingBottom: Platform.OS === 'ios' ? -20 : 0,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/Icons/icon.png')}
            resizeMode="contain"
            style={{ width: '100%', height: '100%' }}
          />
        </View>
        <Text style={styles.Zag}>FastShark</Text>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f2f2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Zag: {
    fontWeight: '700',
    marginLeft: 15,
    fontSize: 28,
    color: "#222",
    letterSpacing: 0.5,
  },
  safeArea: {
    backgroundColor: '#fff',
  },
});
