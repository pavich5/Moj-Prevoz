import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useTranslation } from "react-i18next";
import api from "./api";
import { OtpInput } from "react-native-otp-entry";
type VerificationScreenProps = {
  onSuccess: () => void;
  phoneNumber?: string;
};

const VerificationScreen: React.FC<VerificationScreenProps> = ({
  onSuccess,
  phoneNumber,
}) => {
  const { t } = useTranslation();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(20);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalId);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [canResend]);

  const handleVerifyCode = async (code: string) => {
    setLoadingVerify(true);
    try {
      const response = await api.post(`Twilio/verify-sms-code`, { code });
      if (response.data) {
        onSuccess();
      } else {
        setLoadingVerify(false);
        setIsCodeValid(false);
        setCanResend(true);
      }
    } catch (error) {
      setLoadingVerify(false);
      console.error("Failed to verify code", error);
      setIsCodeValid(false);
      setCanResend(true);
    }
  };

  const handleResendCode = async () => {
    if (timer > 1) return;
    setCanResend(false);
    setTimer(20);
    setIsCodeValid(true);
    setVerificationCode("");

    try {
      await api.post(`Twilio/send-sms`, {
        to: phoneNumber,
      });
    } catch (error) {
      console.error("Failed to send verification code", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("enterVerificationCode")}</Text>
        <View style={styles.inputContainer}>
          <OtpInput
            numberOfDigits={6}
            focusColor="green"
            autoFocus
            hideStick
            disabled={false}
            type="numeric"
            secureTextEntry={false}
            focusStickBlinkingDuration={500}
            onTextChange={(text) => setVerificationCode(text)}
            onFilled={(text) => {
              setVerificationCode(text);
              handleVerifyCode(text);
            }}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
          />
        </View>
        {!isCodeValid && (
          <Text style={styles.errorText}>{t("invalidVerificationCode")}</Text>
        )}

        <TouchableOpacity
          style={styles.verifyButton}
          disabled={loadingVerify || verificationCode.length < 6}
          onPress={() => handleVerifyCode(verificationCode)}
        >
          {loadingVerify ? (
            <ActivityIndicator size="small" color="#2E2E2E" />
          ) : (
            <Text style={styles.verifyButtonText}>{t("verifyPhoneNumber")}</Text>
          )}
        </TouchableOpacity>

        {!isCodeValid && canResend && (
          <TouchableOpacity
            style={[styles.resendButton, timer > 1 && { opacity: 0.5 }]}
            onPress={handleResendCode}
            disabled={timer > 1}
          >
            <Text style={styles.resendButtonText}>
              {t("resendVerificationCode")} ({timer}s)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 20,
  },
  verifyButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#4797C8",
    borderRadius: 8,
    elevation: 3,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  resendButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#f44336",
    borderRadius: 8,
    elevation: 3,
  },
  resendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
});

export default VerificationScreen;
