import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { styles } from "../assets/styles/LoginStyles";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";

type LoginScreenProps = {
  loginPhoneNumber: string;
  setLoginPhoneNumber: (phone: string) => void;
  loginPhoneNumberValid: boolean;
  setLoginPhoneNumberValid: (isValid: boolean) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  loginPasswordValid: boolean;
  setLoginPasswordValid: (isValid: boolean) => void;
  loginPasswordVisible: boolean;
  setLoginPasswordVisible: (visible: boolean) => void;
  handleForgotPassword: () => void;
  handleLogin: () => void;
  toggleScreen: () => void;
  loginButtonLoading: boolean;
};

const LoginScreen: React.FC<LoginScreenProps> = ({
  loginPhoneNumber,
  setLoginPhoneNumber,
  loginPhoneNumberValid,
  setLoginPhoneNumberValid,
  loginPassword,
  setLoginPassword,
  loginPasswordValid,
  setLoginPasswordValid,
  loginPasswordVisible,
  setLoginPasswordVisible,
  handleForgotPassword,
  handleLogin,
  toggleScreen,
  loginButtonLoading,
}) => {
  const { t } = useTranslation();

  const validateLoginPhoneNumber = (phone: string) => {
    let formattedPhone = phone;
    if (phone.startsWith("0")) {
      formattedPhone = phone.replace(/^0/, "+389");
    }

    // Validate the number after formatting
    const isValid = /^\+3897[0-9]{7}$/.test(formattedPhone);
    setLoginPhoneNumber(formattedPhone);
    setLoginPhoneNumberValid(isValid);
  };

  const validateLoginPassword = (password: string) => {
    const isValid =
      password.length >= 6 && !/^(123|234|345|456|567|678|789)$/.test(password);
    setLoginPasswordValid(isValid);
    setLoginPassword(password);
  };

  return (
    <View style={[styles.container, { marginTop: 45 }]}>
      <Text style={styles.title}>{t("loginTitle")}</Text>
      <TextInput
        placeholder={t("enterPhoneNumber")}
        placeholderTextColor={"#666"}
        style={[
          styles.input,
          {
            borderColor: loginPhoneNumberValid ? "#ddd" : "red",
            marginBottom: loginPhoneNumberValid ? 15 : 0,
            minWidth: "100%",
            maxWidth: "100%",
          },
        ]}
        keyboardType="numeric"
        textContentType="telephoneNumber"
        value={loginPhoneNumber}
        onChangeText={validateLoginPhoneNumber}
      />
      {!loginPhoneNumberValid && (
        <Text style={styles.errorText}>{t("invalidPhoneNumber")}</Text>
      )}
      <View style={styles.passwordContainerLogin}>
        <TextInput
          placeholder={t("passwordPlaceholder")}
          style={[
            styles.passwordInput,
            { borderColor: loginPasswordValid ? "#ddd" : "red" },
          ]}
          placeholderTextColor={"#666"}
          secureTextEntry={!loginPasswordVisible}
          value={loginPassword}
          onChangeText={validateLoginPassword}
        />
        <TouchableOpacity
          onPress={() => setLoginPasswordVisible(!loginPasswordVisible)}
        >
          <Feather
            name={loginPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {!loginPasswordValid && (
        <Text style={styles.errorText}>{t("simplePasswordError")}</Text>
      )}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>{t("forgotPassword")}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={toggleScreen}>
          <Text style={styles.signUpButtonText}>{t("signUp")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={loginButtonLoading}
          style={styles.signInButton}
          onPress={handleLogin}
        >
          {loginButtonLoading ? (
            <ActivityIndicator color="#2E2E2E" />
          ) : (
            <Text style={styles.signInButtonText}>{t("signIn")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
