import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Помилка збереження:', e);
  }
};

const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error('Помилка читання:', e);
    return null;
  }
};

const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Помилка видалення:', e);
  }
};
export { storeData, getData, removeData };