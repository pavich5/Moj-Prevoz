import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  Linking,
  ActivityIndicator,
  Platform,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { styles as loginStyles, styles } from "../assets/styles/LoginStyles";
import { useTranslation } from "react-i18next";
import VerificationScreen from "./VerificationScreen";
import { CustomCheckbox } from "./CustomCheckbox";
import api from "./api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "@/app/(tabs)/AllPosts";
import LottieView from "lottie-react-native";

type SignUpScreenProps = {
  profileImage: string | null;
  setProfileImage: (uri: string | null) => void;
  createUserEmail: string;
  setCreateUserEmail: (email: string) => void;
  createUserEmailValid: boolean;
  setCreateUserEmailValid: (isValid: boolean) => void;
  userFirstName: string;
  setUserFirstName: (name: string) => void;
  userLastName: string;
  setUserLastName: (name: string) => void;
  createUserPassword: string;
  setCreateUserPassword: (password: string) => void;
  createPasswordVisible: boolean;
  setCreatePasswordVisible: (visible: boolean) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  confirmPasswordVisible: boolean;
  setConfirmPasswordVisible: (visible: boolean) => void;
  createPasswordValid: boolean;
  setCreatePasswordValid: (isValid: boolean) => void;
  handleCreateAccount: () => void;
  toggleScreen: () => void;
  handleImagePick: () => void;
  createUserPhoneNumber: string;
  setCreateUserPhoneNumber: (value: string) => void;
  createUserPhoneNumberValid: boolean;
  setCreateUserPhoneNumberValid: (value: boolean) => void;
  imageUploadLoading: boolean;
  setDateOfBirth: (value: string) => void;
  dateOfBirth: string;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  profileImage,
  setProfileImage,
  createUserEmail,
  setCreateUserEmail,
  createUserEmailValid,
  setCreateUserEmailValid,
  userFirstName,
  setUserFirstName,
  userLastName,
  setUserLastName,
  createUserPassword,
  setCreateUserPassword,
  createPasswordVisible,
  setCreatePasswordVisible,
  confirmPassword,
  setConfirmPassword,
  confirmPasswordVisible,
  setConfirmPasswordVisible,
  createPasswordValid,
  setCreatePasswordValid,
  handleCreateAccount,
  toggleScreen,
  handleImagePick,
  createUserPhoneNumber,
  setCreateUserPhoneNumber,
  createUserPhoneNumberValid,
  setCreateUserPhoneNumberValid,
  imageUploadLoading,
  setDateOfBirth,
  dateOfBirth,
}) => {
  const { t } = useTranslation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [agreePrivacyPolicy, setAgreePrivacyPolicy] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [createProfileButtonLoading, setCreateProfileLoading] = useState(false);
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const handleConfirmDate = () => {
    const formattedDate = formatDate(tempDate);
    setDateOfBirth(formattedDate);
    setShowDatePicker(false);
  };

  const validateCreateUserEmail = (email: string) => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    setCreateUserEmail(email);
    setCreateUserEmailValid(isValid);
  };

  const validateMkPhoneNumber = (phoneNumber: string) => {
    let formattedPhoneNumber = phoneNumber;
    if (phoneNumber.startsWith("0")) {
      formattedPhoneNumber = phoneNumber.replace(/^0/, "+389");
    }
    const isValid = /^\+3897\d{7}$/.test(formattedPhoneNumber);
    setCreateUserPhoneNumber(formattedPhoneNumber);
    setCreateUserPhoneNumberValid(isValid);
  };

  const validateCreatePassword = (password: string) => {
    const isValid = password.length >= 6;
    setCreateUserPassword(password);
    setCreatePasswordValid(isValid);
  };
  const handleNext = async () => {
    if (!profileImage) {
      Alert.alert("Please enter profile picture");
      return;
    }
    if (!createUserEmailValid) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (!createPasswordValid || createUserPassword !== confirmPassword) {
      Alert.alert(
        "Error",
        "Passwords do not match or are too simple. Please try again."
      );
      return;
    }
    if (userFirstName.length > 40 || userLastName.length > 40) {
      Alert.alert(
        "Error",
        "First name or last name is too long. Please ensure both names are less than 40 characters."
      );
      return;
    }
    if (
      !createPasswordValid ||
      !createUserEmailValid ||
      !userFirstName ||
      !createUserPhoneNumberValid
    ) {
      Alert.alert(t("missingOrInvalidFields"));
      return;
    }
    setCreateProfileLoading(true);
    try {
      await api.post(`Twilio/send-sms`, {
        to: createUserPhoneNumber,
      });
      setIsVerifying(true);
      setCreateProfileLoading(false);
    } catch (error) {
      setCreateProfileLoading(false);
      console.error("Failed to send verification code", error);
    }
  };

  return (
    <>
      {!isVerifying && (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              maxWidth: "100%",
              marginTop: 8,
            }}
          >
            <Text style={loginStyles.title}>{t("createAccountTitle")}</Text>
            {imageUploadLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <ActivityIndicator size="large" color="#2E2E2E" />
                <Text>Uploading...</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleImagePick}>
                <View style={styles.imagePickerContainer}>
                  <ImageBackground
                    style={styles.imagePickerContainer}
                    imageStyle={{
                      borderRadius: 50,
                      marginBottom: 15,
                      objectFit: "contain",
                    }}
                  >
                    {profileImage ? (
                      <Image
                        source={{
                          uri:
                            profileImage !== "noimage.jpg"
                              ? profileImage
                              : require("../assets/images/user.jpg"),
                        }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <LottieView
                        source={require("../assets/lotties/Animation - 1736077155761.json")} 
                        autoPlay
                        loop
                        style={styles.lottieAnimation}
                      />
                    )}
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            )}
            <TextInput
              placeholder={t("enterPhoneNumber")}
              placeholderTextColor={"#666"}
              style={[
                loginStyles.input,
                {
                  borderColor: createUserPhoneNumberValid ? "#ddd" : "red",
                  marginBottom: createUserPhoneNumberValid ? 15 : 10,
                },
              ]}
              value={createUserPhoneNumber}
              onChangeText={validateMkPhoneNumber}
              keyboardType="numeric"
              textContentType="telephoneNumber"
              autoComplete="tel-device"
            />
            {!createUserPhoneNumberValid && (
              <Text style={loginStyles.errorText}>
                {t("invalidPhoneNumber")}
              </Text>
            )}
            <TextInput
              placeholder={t("enterEmail")}
              placeholderTextColor={"#666"}
              style={[
                loginStyles.input,
                {
                  borderColor: createUserEmailValid ? "#ddd" : "red",
                  marginBottom: createUserEmailValid ? 15 : 0,
                },
              ]}
              value={createUserEmail}
              keyboardType="email-address"
              textContentType="emailAddress"
              onChangeText={validateCreateUserEmail}
            />
            {!createUserEmailValid && (
              <Text style={loginStyles.errorText}>{t("invalidEmail")}</Text>
            )}
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                loginStyles.input,
                {
                  marginBottom: 15,
                },
              ]}
            >
              <Text style={{ color: "#999" }}>
                {dateOfBirth ? dateOfBirth : t("enterDateOfBirth")}
              </Text>
            </TouchableOpacity>
            {showDatePicker && Platform.OS === "ios" && (
              <Modal transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                <View style={loginStyles.modalBackground}>
                  <View style={loginStyles.pickerContainer}>
                    <DateTimePicker

                      value={tempDate}
                      mode="date"
                      display="spinner"
                      textColor="black"
                      maximumDate={eighteenYearsAgo}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setTempDate(selectedDate);
                        }
                      }}
                    />

                    <TouchableOpacity
                      onPress={handleConfirmDate}
                      style={loginStyles.doneButton}
                    >
                      <Text style={{ color: "white" }}>{t("done")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}
            {Platform.OS === "android" && showDatePicker && (
              <DateTimePicker
                value={new Date()}
                accentColor="#4797C8"
                mode="date"
                display="default"
                maximumDate={eighteenYearsAgo}
                textColor="black"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate && event.type !== "dismissed") {
                    const formattedDate = formatDate(selectedDate);
                    setDateOfBirth(formattedDate);
                  }
                }}
              />
            )}
            <View style={loginStyles.nameContainer}>
              <TextInput
                placeholder={t("enterFirstName")}
                style={[loginStyles.input, { maxWidth: "50%" }]}
                placeholderTextColor={"#666"}
                value={userFirstName}
                onChangeText={setUserFirstName}
                maxLength={40}
                textContentType="givenName"
              />
              <TextInput
                value={userLastName}
                placeholder={t("enterLastName")}
                placeholderTextColor={"#666"}
                style={[loginStyles.input, { maxWidth: "50%" }]}
                onChangeText={setUserLastName}
                maxLength={40}
              />
            </View>
            <View
              style={[
                loginStyles.passwordContainer,
                { marginBottom: createPasswordValid ? 15 : 0 },
              ]}
            >
              <TextInput
                secureTextEntry={!createPasswordVisible}
                placeholder={t("createPassword")}
                style={[
                  loginStyles.passwordInput,
                  { borderColor: createPasswordValid ? "#ddd" : "red" },
                ]}
                placeholderTextColor={"#666"}
                value={createUserPassword}
                onChangeText={validateCreatePassword}
              />
              <TouchableOpacity
                onPress={() => setCreatePasswordVisible(!createPasswordVisible)}
              >
                <Feather
                  name={createPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {!createPasswordValid && (
              <Text style={loginStyles.errorText}>{t("strongerPassword")}</Text>
            )}
            <View
              style={[
                loginStyles.passwordContainer,
                { marginBottom: createPasswordValid ? 15 : 0 },
              ]}
            >
              <TextInput
                placeholder={t("confirmPassword")}
                secureTextEntry={!confirmPasswordVisible}
                style={[
                  loginStyles.passwordInput,
                  { borderColor: createPasswordValid ? "#ddd" : "red" },
                ]}
                value={confirmPassword}
                placeholderTextColor={"#666"}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                <Feather
                  name={confirmPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%" }}>
              <CustomCheckbox
                //@ts-ignore
                text={
                  <Text style={{ fontSize: 12, color: "#333", lineHeight: 18 }}>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL("https://mojprevoz.com/privacy-policy/")
                      }
                    >
                      <Text
                        style={{
                          color: "#007BFF",
                          textDecorationLine: "underline",
                          fontWeight: "500",
                        }}
                      >
                        {t("privacyPolicyAgreement")}
                      </Text>
                    </TouchableOpacity>
                  </Text>
                }
                value={agreePrivacyPolicy}
                onValueChange={setAgreePrivacyPolicy}
              />
            </View>

            <TouchableOpacity
              style={[
                loginStyles.nextButton,
                { opacity: agreePrivacyPolicy ? 1 : 0.8 },
              ]}
              onPress={handleNext}
              disabled={!agreePrivacyPolicy || createProfileButtonLoading}
            >
              {createProfileButtonLoading ? (
                <ActivityIndicator color="#2E2E2E" />
              ) : (
                <Text style={loginStyles.nextButtonText}>{t("next")}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleScreen}>
              <Text style={loginStyles.switchToLogin}>
                {t("alreadyHaveAccount")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      {isVerifying && (
        <VerificationScreen
          phoneNumber={createUserPhoneNumber}
          onSuccess={handleCreateAccount}
        />
      )}
      {/* <ConfirmationModal
        visible={policiesModalVisible}
        onClose={() => setPoliciesModalVisible(false)}
        onConfirm={handleAcceptPolicies}
      /> */}
    </>
  );
};

export default SignUpScreen;
