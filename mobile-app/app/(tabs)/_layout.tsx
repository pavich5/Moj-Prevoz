import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, View, Text, StyleSheet, Platform } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { checkUserLoggedIn } from "@/components/callApi";
import { useAuth } from "../../hooks/AuthContext";
import { useTranslation } from "react-i18next";

type ThemeContextType = {
  theme: "light" | "dark";
};

export default function TabLayout(): JSX.Element | null {
  const { userId,isThemeWhite } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const isDarkTheme = !isThemeWhite;
  const [userLogged, setIsUserLogged] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isUserLogged = await checkUserLoggedIn();
      setIsUserLogged(isUserLogged);
    };
    checkLoginStatus();
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!userLogged) {
    if (!showContent) {
      return null; 
    }

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkTheme ? "#1C1C1E" : "#FFFFFF" },
        ]}
      >
        <Text
          style={[
            styles.loginText,
            { color: isDarkTheme ? "#E0E0E0" : "#000000" },
          ]}
        >
          {t("pleaseLogIn")}
        </Text>
        <Button title={t("login")} onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkTheme ? "white" : "#2E2E2E",
        tabBarInactiveTintColor: isDarkTheme ? "#E0E0E0" : "#333",
        tabBarStyle: {
          backgroundColor: isDarkTheme ? "#1C1C1E" : "#FFFFFF",
          height: Platform.OS === "ios" ? 75 : 60,
          borderTopColor: isDarkTheme ? "#2E2E2E" : "#E0E0E0",
          shadowColor: "#000", // Shadow color
          shadowOffset: { width: 0, height: -3 }, // Move shadow up
          shadowOpacity: 0.1, // Adjust shadow opacity
          shadowRadius: 4, // Adjust shadow spread
          elevation: 6, // For Android shadow
        },        
        headerStyle: {
          backgroundColor: isDarkTheme ? "#1C1C1E" : "#FFFFFF",
        },
        tabBarIconStyle: {
          marginTop: 4, // Adjust this value as needed
        },
        headerTitleStyle: {
          display: "none",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="AllPosts"
        options={{
          tabBarLabel: "", // Remove text
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myPosts"
        options={{
          tabBarLabel: "", // Remove text
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "list" : "list-outline"}
              color={color}
              size={34}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="createPost"
        options={{
          tabBarLabel: "", // Remove text
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
              size={34}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="savedPosts"
        options={{
          tabBarLabel: "", // Remove text
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bookmark" : "bookmark-outline"}
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "", // Remove text
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
              size={30}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
