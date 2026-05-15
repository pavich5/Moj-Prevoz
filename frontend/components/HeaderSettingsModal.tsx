import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Link } from "expo-router";
import { styles } from "../assets/styles/HeaderStyles";
import { logoutUser } from "./callApi";
import BlockedUsersModal from "./BlockedUserList";
import api from "./api";
import { useAuth } from "@/hooks/AuthContext";

interface HeaderSettingsModalProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  changingPassword: boolean;
  setChangingPassword: (value: boolean) => void;
  isDarkTheme: boolean;
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  handleSavePassword: () => void;
  setUserDetails: (details: any) => void;
  setUserId: (id: string | null) => void;
  t: any;
  jwtToken: string | null;
  setJwtToken: (value: string | null) => void;
  userId: string | null;
}

const HeaderSettingsModal: React.FC<HeaderSettingsModalProps> = ({
  modalVisible,
  setModalVisible,
  changingPassword,
  setChangingPassword,
  isDarkTheme,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleSavePassword,
  setUserDetails,
  setUserId,
  t,
  jwtToken,
  setJwtToken,
  userId,
}) => {
  const { toggleTheme } = useAuth();
  const [isBlockedUsersModalVisible, setIsBlockedUserVisable] = useState(false);
  const [isBlockedUsersLoading, setIsBlockedUsersLoading] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const handleOnBlockedUsersClick = async () => {
    setIsBlockedUsersLoading(true);
    try {
      setIsBlockedUserVisable(true);
      const response = await api.get(
        `/Users/blocked-users/${Number.parseInt(userId ?? "")}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setBlockedUsers(response.data);
      setIsBlockedUsersLoading(false);
    } catch (error) {
      Alert.alert("Error fetching blocked users, please try again later");
      setIsBlockedUsersLoading(false);
    }
  };
  const handleUnblock = async (userToUnblock: number) => {
    try {
      const payload = {
        BlockingUserId: Number.parseInt(userId ?? ""),
        BlockedUserId: userToUnblock,
      };
      await api.delete(`/Users/unblock-user`, {
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setBlockedUsers((prev) =>
        //@ts-ignore
        prev.filter((user) => user.id !== userToUnblock)
      );
    } catch (error) {
      Alert.alert("Error unblocking user, please try again later");
      console.error("Error unblocking user:", error);
      setIsBlockedUsersLoading(false);
    }
  };
  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        setModalVisible(false);
        setChangingPassword(false);
      }}
      onPointerCancel={() => {
        setModalVisible(false);
        setChangingPassword(false);
      }}
    >
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDarkTheme ? "#1C1C1E" : "white",
              height: changingPassword ? 350 : 380,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(false);
              setChangingPassword(false);
            }}
          >
            <Icon name="x" size={24} color={isDarkTheme ? "#E0E0E0" : "#000"} />
          </TouchableOpacity>

          {changingPassword ? (
            <>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setChangingPassword(false)}
              >
                <Icon name="arrow-left" size={24} color="#4797C8" />
              </TouchableOpacity>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDarkTheme ? "#E0E0E0" : "#000" },
                ]}
              >
                {t("headerSettingsModal.changePassword")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkTheme ? "#2C2C2E" : "white",
                    color: isDarkTheme ? "#E0E0E0" : "#000",
                  },
                ]}
                placeholder={t("headerSettingsModal.currentPassword")}
                placeholderTextColor={isDarkTheme ? "#8E8E93" : "#666"}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkTheme ? "#2C2C2E" : "white",
                    color: isDarkTheme ? "#E0E0E0" : "#000",
                  },
                ]}
                placeholder={t("headerSettingsModal.newPassword")}
                placeholderTextColor={isDarkTheme ? "#8E8E93" : "#666"}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDarkTheme ? "#2C2C2E" : "white",
                    color: isDarkTheme ? "#E0E0E0" : "#000",
                  },
                ]}
                placeholder={t("headerSettingsModal.confirmNewPassword")}
                placeholderTextColor={isDarkTheme ? "#8E8E93" : "#666"}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSavePassword}
              >
                <Text style={styles.saveButtonText}>
                  {t("headerSettingsModal.save")}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDarkTheme ? "#E0E0E0" : "#000" },
                ]}
              >
                {t("headerSettingsModal.settings")}
              </Text>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isDarkTheme ? "#333" : "#4797C8",
                  },
                ]}
                onPress={() => setChangingPassword(true)}
              >
                <Text style={styles.optionButtonText}>
                  {t("headerSettingsModal.changePassword")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isDarkTheme ? "#333" : "#4797C8",
                  },
                ]}
                onPress={(e) => {
                  toggleTheme();
                  e.preventDefault(); 
                }}
                activeOpacity={1}
              >
                <Text style={styles.optionButtonText}>
                  {t("headerSettingsModal.theme")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isDarkTheme ? "#333" : "#4797C8",
                  },
                ]}
                onPress={() => void handleOnBlockedUsersClick()}
              >
                <Text style={styles.optionButtonText}>
                  {t("viewBlockedUsers")}
                  {isBlockedUsersLoading && <ActivityIndicator />}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isDarkTheme ? "#333" : "#4797C8",
                  },
                ]}
                onPress={() => {
                  void logoutUser(jwtToken ?? "");
                  setModalVisible(false);
                  setUserDetails(null);
                  setUserId(null);
                  setJwtToken(null);
                }}
              >
                <Link href="/login">
                  <Text style={styles.optionButtonText}>
                    {t("headerSettingsModal.logout")}
                  </Text>
                </Link>
              </TouchableOpacity>
            </>
          )}
        </View>
        <BlockedUsersModal
          visible={isBlockedUsersModalVisible}
          onClose={() => setIsBlockedUserVisable(false)}
          blockedUsers={blockedUsers}
          onUnblock={(unblockedUserId) =>
            handleUnblock(Number.parseInt(unblockedUserId))
          }
          isBlockedUsersLoading={isBlockedUsersLoading}
        />
      </View>
    </Modal>
  );
};

export default HeaderSettingsModal;
