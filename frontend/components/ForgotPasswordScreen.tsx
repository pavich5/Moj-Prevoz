import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { styles } from "../assets/styles/LoginStyles";
import { useTranslation } from "react-i18next";
import api from "./api";
import { appConfig } from "@/constants/config";
import axios from "axios";

type ForgotPasswordScreenProps = {
  goBack: () => void;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginEmailValid: boolean;
  setLoginEmailValid: (isValid: boolean) => void;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  goBack,
  loginEmail,
  setLoginEmail,
  loginEmailValid,
  setLoginEmailValid,
}) => {
  const { t } = useTranslation();
  const [codeSent, setCodeSent] = useState(false);
  const [verificationButtonLoading, setVerificationButtonLoading] =
    useState(false);
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [passwordValidationError, setPasswordValidationError] = useState("");
  const [tempJwtToken, setTempJwtToken] = useState<string | null>(null);

  const validateLoginEmail = (email: string) => {
    setLoginEmail(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setLoginEmailValid(emailRegex.test(email));
  };

  const handleSendCode = async () => {
    if (!loginEmailValid || !loginEmail) {
      Alert.alert(t("somethingWentWrong"));
      return;
    }
    setVerificationButtonLoading(true);
    try {
      await api.post(`Public/forgot-password?email=${loginEmail}`);
      setCodeSent(true);
      setVerificationButtonLoading(false);
    } catch (error) {
      setVerificationButtonLoading(false);
      Alert.alert(t("somethingWentWrong"));
      console.error("Failed to send code", error);
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    if (code.length < 6) return;
    setVerificationButtonLoading(true);
    try {
      const response = await api.post("Public/verify-code", {
        email: loginEmail,
        code,
      });
      if (response.data) {
        setTempJwtToken(response.data.token);
        setIsCodeVerified(true);
      } else {
        setIsCodeValid(false);
      }
    } catch (error) {
      console.error("Failed to verify code", error);
      setIsCodeValid(false);
      setVerificationButtonLoading(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedCode = [...verificationCode];
    updatedCode[index] = value;
    setVerificationCode(updatedCode);

    if (value && index < verificationCode.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordsMatch(true);
    setPasswordValidationError("");

    if (newPassword === "" || confirmPassword === "") return;

    if (newPassword.length < 6) {
      setPasswordValidationError(t("passwordMustBeAtLeast6Chars"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setUpdatePasswordLoading(true);
    try {
      await axios.post(
        `${appConfig.apiBaseUrl}/Public/reset-password`,
        {
          email: loginEmail,
          newPassword,
          isFromForgotPassword: true,
          token: tempJwtToken,
        },
        {
          headers: {
            Authorization: `Bearer ${tempJwtToken}`,
          },
        }
      );

      setTempJwtToken(null);
      Alert.alert(t("passwordUpdateSuccess"), t("passwordSuccessfullyUpdated"));
      goBack();
    } catch (error) {
      setUpdatePasswordLoading(false);
      Alert.alert(t("passwordChangeFailure"), t("passwordChangeError"));
    }
  };

  return (
    <>
      {!codeSent ? (
        <View style={{ width: "95%", marginTop: 35 }}>
          <Text style={styles.title}>{t("forgotPasswordTitle")}</Text>
          <TextInput
            placeholder={t("enterEmail")}
            style={[
              styles.input,
              {
                borderColor: loginEmailValid ? "#ddd" : "red",
                marginBottom: loginEmailValid ? 15 : 0,
              },
            ]}
            keyboardType="email-address"
            value={loginEmail}
            onChangeText={validateLoginEmail}
          />
          {!loginEmailValid && (
            <Text style={styles.errorText}>{t("invalidEmailAddress")}</Text>
          )}
          <TouchableOpacity
            style={styles.nextButton}
            disabled={verificationButtonLoading}
            onPress={handleSendCode}
          >
            {verificationButtonLoading ? (
              <ActivityIndicator color="#2E2E2E" />
            ) : (
              <Text style={styles.nextButtonText}>{t("sendCode")}</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : !isCodeVerified ? (
        <View>
          <Text style={[styles.title, { marginTop: 35, marginBottom: 0 }]}>
            {t("enterVerificationCode")}
          </Text>
          <View style={styles.verificationCodeContainer}>
            {verificationCode.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.verificationInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleInputChange(index, value)}
                ref={(ref) => (inputRefs.current[index] = ref)}
              />
            ))}
          </View>
          {!isCodeValid && (
            <Text style={styles.errorText}>{t("invalidVerificationCode")}</Text>
          )}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleVerifyCode}
            disabled={verificationButtonLoading}
          >
            {verificationButtonLoading ? (
              <ActivityIndicator color="#2E2E2E" />
            ) : (
              <Text style={styles.nextButtonText}>{t("verifyEmail")}</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.passwordUpdateContainer}>
          <Text style={styles.passwordUpdateTitle}>
            {t("createNewPassword")}
          </Text>
          <TextInput
            placeholder={t("newPassword")}
            style={[
              styles.newPasswordInput,
              { borderColor: passwordsMatch ? "#ddd" : "red" },
            ]}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            placeholder={t("confirmPassword")}
            style={[
              styles.newPasswordInput,
              { borderColor: passwordsMatch ? "#ddd" : "red" },
            ]}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {!passwordsMatch && (
            <Text style={styles.passwordErrorText}>
              {t("passwordsDoNotMatch")}
            </Text>
          )}
          {passwordValidationError && (
            <Text style={styles.passwordErrorText}>
              {passwordValidationError}
            </Text>
          )}
          <TouchableOpacity
            style={styles.passwordUpdateButton}
            onPress={handleUpdatePassword}
            disabled={updatePasswordLoading}
          >
            {updatePasswordLoading ? (
              <ActivityIndicator color="#2E2E2E" />
            ) : (
              <Text style={styles.passwordUpdateButtonText}>
                {t("updatePassword")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ForgotPasswordScreen;
