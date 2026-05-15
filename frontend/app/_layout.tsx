import "intl-pluralrules";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import React from "react";
import Header from "@/components/Header";
import { AuthProvider, useAuth } from "../hooks/AuthContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { useRouter } from "expo-router";
import { checkUserLoggedIn } from "@/components/callApi";
import LoadingScreen from "@/components/LoadingScreen";
import * as SecureStore from "expo-secure-store";
import { appConfig } from "@/constants/config";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const [fontsLoaded] = useFonts({
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    RobotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
  });

  const router = useRouter();
  const { userId } = useAuth();
  const [userLogged, setUserLogged] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isUserLogged = await checkUserLoggedIn();
        setUserLogged(isUserLogged);
      } catch (error) {
        console.error("Login check failed: ", error);
        setUserLogged(false);
      }
    };

    checkLoginStatus();
  }, [userId]);

  useEffect(() => {
    const loadSecretKey = async () => {
      if (!appConfig.encryptedApiKey) {
        return;
      }

      const storedSecretKey = await SecureStore.getItemAsync(
        "X_MOJPREVOZ_SECRET_KEY"
      );

      if (storedSecretKey !== appConfig.encryptedApiKey) {
        await SecureStore.setItemAsync(
          "X_MOJPREVOZ_SECRET_KEY",
          appConfig.encryptedApiKey
        );
      }
    };

    if (fontsLoaded && userLogged !== null) {
      loadSecretKey();
      SplashScreen.hideAsync();
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [fontsLoaded, userLogged]);

  useEffect(() => {
    if (!loading && fontsLoaded && userLogged !== null) {
      if (userLogged) {
        if (pathname !== "/profile") {
          router.push("/(tabs)/AllPosts");
        }
      } else {
        router.push("/login");
      }
    }
  }, [loading, fontsLoaded, userLogged, router]);

  if (loading || !fontsLoaded || userLogged === null) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            gestureEnabled: false, // Disable swipe gesture here
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="userdetails/[id]"
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="messages"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </I18nextProvider>
  );
}
