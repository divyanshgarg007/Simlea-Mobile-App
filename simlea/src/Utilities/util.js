import AsyncStorage from '@react-native-async-storage/async-storage';


export const getToken = async key => {
  let data = await AsyncStorage.getItem(key);
  return data;
};

export const setToken = async (key, value) => {
  return await AsyncStorage.setItem(key, value);
};


