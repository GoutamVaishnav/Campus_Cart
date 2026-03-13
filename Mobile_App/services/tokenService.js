import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);
};

export const saveUser = async (user) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export const getAccessToken = async () => {
  return await AsyncStorage.getItem("accessToken");
};

export const getRefreshToken = async () => {
  return await AsyncStorage.getItem("refreshToken");
};
