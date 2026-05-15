import React, { useState } from "react";
import { View, TouchableOpacity, Alert, Image, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "../assets/styles/LoginStyles";
import {
  loginUser,
  registerForPushNotificationsAsync,
  registerUser,
} from "@/components/callApi";
import { useAuth } from "../hooks/AuthContext";
import { useRouter } from "expo-router";
import ForgotPasswordScreen from "@/components/ForgotPasswordScreen";
import LoginScreen from "@/components/LoginScreen";
import SignUpScreen from "@/components/SignUpScreen";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { getImgbbUploadUrl } from "@/constants/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImageManipulator from "expo-image-manipulator";
import api from "@/components/api";

const macedonianFlag = require("../assets/images/macedonianFlage.png");
const ukFlag = require("../assets/images/ukFlag.png");
const logo = require("../assets/images/logo1.png");
const hatImage = require("../assets/images/hat.png");
const LoginSignUpScreen: React.FC = () => {
  const { setUserId, setJwtToken, userId } = useAuth();
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState<"mk" | "en">("mk");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // State variables for login
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginPasswordVisible, setLoginPasswordVisible] =
    useState<boolean>(false);
  const [loginEmailValid, setLoginEmailValid] = useState<boolean>(true);
  const [loginPasswordValid, setLoginPasswordValid] = useState<boolean>(true);

  // State variables for user creation
  const [createUserEmail, setCreateUserEmail] = useState<string>("");
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userLastName, setUserLastName] = useState<string>("");
  const [createUserEmailValid, setCreateUserEmailValid] =
    useState<boolean>(true);
  const [createUserPassword, setCreateUserPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [createPasswordVisible, setCreatePasswordVisible] =
    useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);
  const [createPasswordValid, setCreatePasswordValid] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [createUserPhoneNumber, setCreateUserPhoneNumber] = useState("");
  const [createUserPhoneNumberValid, setCreateUserPhoneNumberValid] =
    useState(true);
  // State variables for screen visibility
  const [isLoginScreen, setIsLoginScreen] = useState<boolean>(true);
  const [isCreateScreen, setIsCreateScreen] = useState<boolean>(false);
  const [isForgotPasswordScreen, setIsForgotPasswordScreen] =
    useState<boolean>(false);
  const [loginPhoneNumber, setLoginPhoneNumber] = useState<string>("");
  useState<boolean>(false);
  const [loginPhoneNumberValid, setLoginPhoneNumberValid] =
    useState<boolean>(true);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const toggleScreen = () => {
    setIsLoginScreen((prev) => !prev);
    setIsCreateScreen((prev) => !prev);
  };

  const [loginButtonLoading, setLoginButtonLoading] = useState(false);
  const handleForgotPassword = () => {
    setIsLoginScreen(false);
    setIsCreateScreen(false);
    setIsForgotPasswordScreen(true);
  };

  const goBack = () => {
    setIsForgotPasswordScreen(false);
    setIsLoginScreen(true);
    setIsCreateScreen(false);
  };

  const handleLogin = async () => {
    if (
      !loginPhoneNumber ||
      !loginPassword ||
      !loginPhoneNumberValid ||
      !loginPasswordValid
    ) {
      Alert.alert("Error", "Please enter both phone number and password.");
      return;
    }

    return await performLogin(loginPhoneNumber, loginPassword);
  };
  const performLogin = async (
    phoneNumber: string,
    password: string
  ): Promise<{ status: boolean; newUserId?: string }> => {
    setLoginButtonLoading(true); 
    try {
      const { status, userId, token } = await loginUser({
        phoneNumber,
        password,
      });
      if (userId) {
        setUserId(userId);
        setJwtToken(token as string);
        router.push("/(tabs)/AllPosts");
        setLoginButtonLoading(false);
        return {
          status: true,
          newUserId: userId,
        };
      } else if (status === 401) {
        setLoginButtonLoading(false);
        Alert.alert("Invalid credentials, please try again.");
      } else {
        setLoginButtonLoading(false);
        Alert.alert("Login failed, please try again later.");
      }
    } catch (error) {
      setLoginButtonLoading(false);
      Alert.alert("Error", (error as Error).message);
    } 
    setLoginButtonLoading(false);
    return { status: false };
  };

  const handleCreateAccount = async () => {
    const imageUrl = profileImage ?? "noimage.jpg";

    try {
      // Register the user with the necessary details
      const status = await registerUser({
        createUserEmail,
        password: createUserPassword,
        confirmPassword,
        profileImage: imageUrl,
        userFirstName,
        userLastName,
        phoneNumber: createUserPhoneNumber,
        dateOfBirth,
      });

      if (status === 201) {
        const loginSuccess = await performLogin(
          createUserPhoneNumber,
          createUserPassword
        );

        if (loginSuccess.status) {
          if(Platform.OS === "ios"){
            const notificationToken = await registerForPushNotificationsAsync();
            if (notificationToken) {
              await api.patch("/Users/saveNotificationToken", {
                userId: Number.parseInt(loginSuccess.newUserId ?? ""),
                notificationToken,
              });
            }
          }
          setIsCreateScreen(false);
          setIsLoginScreen(true);
        }
      } else {
        Alert.alert("Account creation failed. Please try again.");
      }
    } catch (error) {
      Alert.alert("Profile creation error", (error as Error).message);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "mk" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const uploadImage = async (uri: string) => {
    setImageUploadLoading(true);
    try {
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 700, height: 700 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      const formData = new FormData();
      //@ts-ignore
      formData.append("image", {
        uri: compressedImage.uri,
        name: "image.jpg",
        type: "image/jpeg",
      });

      const response = await axios.post(getImgbbUploadUrl(), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImageUploadLoading(false);
      return response.data.data.url;
    } catch (error) {
      console.error(error);
      setImageUploadLoading(false);
      return "noimage.jpg";
    }
  };

    const handleImagePick = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1], // Force 1:1 aspect ratio
        allowsMultipleSelection: false // Only allow single image selection
      });

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        const uploadedUrl = await uploadImage(fileUri);
        if (uploadedUrl) {
          setProfileImage(uploadedUrl);
        }
      }
    };
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            height: 45 + insets.top,
          },
        ]}
      >
        {(isForgotPasswordScreen || isCreateScreen) && (
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )}
        <View style={styles.logoWrapper}>
          <Image style={styles.logoImage} source={logo} />
        </View>
        <TouchableOpacity onPress={toggleLanguage} style={styles.flagToggle}>
          <Image
            source={language === "en" ? ukFlag : macedonianFlag}
            style={styles.flagIcon}
          />
        </TouchableOpacity>
      </View>

      {isForgotPasswordScreen && (
        <ForgotPasswordScreen
          goBack={goBack}
          loginEmail={loginEmail}
          loginEmailValid={loginEmailValid}
          setLoginEmail={setLoginEmail}
          setLoginEmailValid={setLoginEmailValid}
        />
      )}

      {isLoginScreen && !isForgotPasswordScreen && !isCreateScreen && (
        <LoginScreen
          loginPhoneNumber={loginPhoneNumber}
          setLoginPhoneNumber={setLoginPhoneNumber}
          loginPhoneNumberValid={loginPhoneNumberValid}
          setLoginPhoneNumberValid={setLoginPhoneNumberValid}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loginPasswordValid={loginPasswordValid}
          setLoginPasswordValid={setLoginPasswordValid}
          loginPasswordVisible={loginPasswordVisible}
          setLoginPasswordVisible={setLoginPasswordVisible}
          handleForgotPassword={handleForgotPassword}
          handleLogin={handleLogin}
          toggleScreen={toggleScreen}
          loginButtonLoading={loginButtonLoading}
        />
      )}

      {isCreateScreen && !isForgotPasswordScreen && (
        <SignUpScreen
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          handleImagePick={handleImagePick}
          createUserEmail={createUserEmail}
          setCreateUserEmail={setCreateUserEmail}
          createUserEmailValid={createUserEmailValid}
          setCreateUserEmailValid={setCreateUserEmailValid}
          userFirstName={userFirstName}
          setUserFirstName={setUserFirstName}
          userLastName={userLastName}
          setUserLastName={setUserLastName}
          createUserPassword={createUserPassword}
          setCreateUserPassword={setCreateUserPassword}
          createPasswordVisible={createPasswordVisible}
          setCreatePasswordVisible={setCreatePasswordVisible}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          confirmPasswordVisible={confirmPasswordVisible}
          setConfirmPasswordVisible={setConfirmPasswordVisible}
          createPasswordValid={createPasswordValid}
          setCreatePasswordValid={setCreatePasswordValid}
          handleCreateAccount={handleCreateAccount}
          toggleScreen={toggleScreen}
          createUserPhoneNumber={createUserPhoneNumber}
          createUserPhoneNumberValid={createUserPhoneNumberValid}
          setCreateUserPhoneNumber={setCreateUserPhoneNumber}
          setCreateUserPhoneNumberValid={setCreateUserPhoneNumberValid}
          imageUploadLoading={imageUploadLoading}
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
        />
      )}
    </View>
  );
};

export default LoginSignUpScreen;
