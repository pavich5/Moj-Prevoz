import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { appConfig } from "@/constants/config";

// Create an Axios instance
const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("jwtToken");
    const secretKey = await SecureStore.getItemAsync("X_MOJPREVOZ_SECRET_KEY");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (secretKey) {
      config.headers["X-Encrypted-ApiKey"] = secretKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
