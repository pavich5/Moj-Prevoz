import { useAuth } from "@/hooks/AuthContext";
import { truncateName } from "@/hooks/helper";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const BlockedUsersModal = ({
  visible,
  onClose,
  blockedUsers,
  onUnblock,
  isBlockedUsersLoading,
}: {
  visible: boolean;
  onClose: () => void;
  blockedUsers: {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
  }[];
  onUnblock: (userId: string) => void;
  isBlockedUsersLoading: boolean;
}) => {
  const { t } = useTranslation();
  const { isThemeWhite } = useAuth();
  const isDarkTheme = !isThemeWhite;

  const renderUser = ({
    item,
  }: {
    item: { id: string; firstName: string; lastName: string; image: string };
  }) => (
    <View
      style={[
        styles.userCard,
        { backgroundColor: isDarkTheme ? "#444" : "#f9f9f9" },
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.userImage} />
      <Text style={[styles.userName, { color: isDarkTheme ? "#fff" : "#000" }]}>
        {truncateName(`${item.firstName} ${item.lastName}`,16)}
      </Text>
      <TouchableOpacity
        onPress={() => onUnblock(item.id)}
        style={styles.unblockButton}
      >
        <Text style={styles.unblockButtonText}>{t("unblock")}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: isDarkTheme ? "#333" : "#fff" },
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 60, bottom: 60, left: 60, right: 60 }}
          >
            <Ionicons
              name="close"
              size={24}
              color={isDarkTheme ? "#fff" : "#2f2f2f"}
            />
          </TouchableOpacity>
          <Text
            style={[styles.title, { color: isDarkTheme ? "#fff" : "#000" }]}
          >
            {t("blockedUsers")}
          </Text>
          {isBlockedUsersLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={isDarkTheme ? "#2E2E2E" : "#2E2E2E"}
              />
            </View>
          ) : blockedUsers.length > 0 ? (
            <FlatList
              data={blockedUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderUser}
            />
          ) : (
            <Text
              style={[
                styles.noUsersText,
                { color: isDarkTheme ? "#ccc" : "#555" },
              ]}
            >
              {t("noBlockedUsers")}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 8,
    padding: 20,
    width: "90%",
    minHeight: 300,
    maxHeight: "80%",
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    right: -15,
    top: 15,
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    flex: 1,
    fontSize: 16,
  },
  unblockButton: {
    backgroundColor: "#4797C8",
    padding: 8,
    borderRadius: 8,
  },
  unblockButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noUsersText: {
    textAlign: "center",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default BlockedUsersModal;
