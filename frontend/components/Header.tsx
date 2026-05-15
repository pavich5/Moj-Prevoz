import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { styles } from "../assets/styles/HeaderStyles";
import { useAuth } from "@/hooks/AuthContext";
import Icon from "react-native-vector-icons/Feather";
import HeaderSettingsModal from "./HeaderSettingsModal";
import { useNavigation, usePathname, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import api from "./api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const macedonianFlag = require("../assets/images/macedonianFlage.png");
const ukFlag = require("../assets/images/ukFlag.png");

export default function Header() {
  const { t, i18n } = useTranslation();
  const {
    jwtToken,
    setJwtToken,
    setUserId,
    setUserDetails,
    userDetails,
    isThemeWhite,
    toggleTheme,
    userId,
  } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState<"mk" | "en">("mk");
  const pathname = usePathname();
  const isDarkTheme = !isThemeWhite;
  const navigate = useNavigation();
  const router = useRouter();
  const toggleLanguage = () => {
    const newLang = language === "en" ? "mk" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const resetModalState = () => {
    setChangingPassword(false);
  };

  const handleSavePassword = async () => {
    if (newPassword === currentPassword) {
      return Alert.alert(t("passwordNotSame"));
    }
    if (newPassword.length < 6) return;
    if (newPassword === confirmPassword) {
      try {
        const response = await api.post("Users/reset-password", {
          email: userDetails?.email,
          oldPassword: currentPassword,
          newPassword,
        });

        if (response.status === 200) {
          Alert.alert(t("passwordChangeSuccess"));
          resetPasswordFields();
        } else {
          Alert.alert(t("passwordChangeFailure"));
        }
      } catch (error) {
        Alert.alert(t("passwordChangeError"));
      }
    } else {
      Alert.alert(t("passwordsDoNotMatch"));
    }
  };

  const resetPasswordFields = () => {
    setChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const shouldHideHeader =
    pathname === "/login" || pathname === "/messages" || !userId;
  const pageTitles: Record<string, string> = {
    "/AllPosts": `Hello${userDetails?.firstName ? ", " + userDetails.firstName + "!" : "..."}`,
    "/profile": t("profile"),
    "/createPost": t("createPost"),
    "/myPosts": t("myPosts"),
    "/savedPosts": t("savedPosts"),
  };
  const headerTitle = pageTitles[pathname] || t("companyName");

  if (shouldHideHeader) {
    return null;
  }
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor={isDarkTheme ? "black" : "white"}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkTheme ? "black" : "white",
            paddingTop: Platform.OS === "ios" ? insets.top : 5,
            height: Platform.OS === "ios" ? 60 + insets.top : 70,
            paddingLeft: 10,
            paddingRight: 10,
          },
        ]}
      >
        {pathname.startsWith("/userdetails/") ? (
          <TouchableOpacity onPress={() => navigate.goBack()}>
            <Icon
              name="arrow-left"
              size={24}
              color={isDarkTheme ? "#E0E0E0" : "#2B2D42"}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (pathname === "/profile") {
                resetModalState();
                setModalVisible(true);
              } else {
                router.push("/(tabs)/profile");
              }
            }}
          >
            {pathname !== "/profile" ? (
              <View
                style={[
                  styles.shadowContainer,
                  isDarkTheme && styles.darkShadow,
                ]}
              >
                <Image
                  source={{
                    uri: `${userDetails?.imageUri}`,
                  }}
                  style={[
                    styles.image,
                    { width: 36, height: 36, borderRadius: 50 / 2 },
                  ]}
                />
              </View>
            ) : (
              <Icon
                name="settings"
                size={24}
                style={{ marginLeft: 6 }}
                color={isDarkTheme ? "#E0E0E0" : "#2B2D42"}
              />
            )}
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.headerTitle,
            { color: isDarkTheme ? "#E0E0E0" : "#2B2D42", marginLeft: 9 },
          ]}
        >
          {headerTitle}
        </Text>

        <TouchableOpacity onPress={toggleLanguage} style={styles.flagToggle}>
          <Image
            source={language === "en" ? ukFlag : macedonianFlag}
            style={styles.flagIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/messages")}
          style={styles.themeToggle}
        >
          <View style={styles.iconContainer}>
            <Icon
              name="message-circle"
              size={24}
              color={isDarkTheme ? "#E0E0E0" : "#2B2D42"}
            />
            {typeof userDetails?.newMessagesCount === "number" &&
              userDetails.newMessagesCount > 0 && (
                <View style={styles.countContainer}>
                  <Text style={styles.countText}>
                    {userDetails.newMessagesCount > 9
                      ? "9+"
                      : String(userDetails.newMessagesCount)}
                  </Text>
                </View>
              )}
          </View>
        </TouchableOpacity>
      </View>
      <HeaderSettingsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        changingPassword={changingPassword}
        setChangingPassword={setChangingPassword}
        isDarkTheme={isDarkTheme}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleSavePassword={handleSavePassword}
        setUserDetails={setUserDetails}
        setUserId={setUserId}
        jwtToken={jwtToken}
        setJwtToken={setJwtToken}
        t={t}
        userId={userId}
      />
    </>
  );
}
