import { useAuth } from "@/hooks/AuthContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

interface BlockUserModalProps {
  isVisible: boolean;
  onClose: () => void;
  onBlock: () => void;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({
  isVisible,
  onClose,
  onBlock,
}) => {
  const { isThemeWhite } = useAuth();
  const { t } = useTranslation();

  const styles = getStyles(isThemeWhite ? "light" : "dark");

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t("blockUser.title")}</Text>
          <Text style={styles.modalMessage}>{t("blockUser.message")}</Text>


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.blockButton} onPress={onBlock}>
              <Text style={styles.buttonText}>
                {t("blockUser.blockButton")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>
                {t("blockUser.cancelButton")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>
              {t("blockUser.unblockInstructions.title")}
            </Text>
            <Text style={styles.instructionText}>
              {t("blockUser.unblockInstructions.step1")}
            </Text>
            <Text style={styles.instructionText}>
              {t("blockUser.unblockInstructions.step2")}
            </Text>
            <Text style={styles.instructionText}>
              {t("blockUser.unblockInstructions.step3")}
            </Text>
            <Text style={styles.instructionText}>
              {t("blockUser.unblockInstructions.step4")}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (theme: string) => {
  const isDarkTheme = theme === "dark";

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkTheme
        ? "rgba(0, 0, 0, 0.9)"
        : "rgba(0, 0, 0, 0.6)",
    },
    modalContainer: {
      backgroundColor: isDarkTheme ? "#333" : "white",
      padding: 24,
      borderRadius: 12,
      width: "90%",
      maxHeight: "80%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "600",
      color: isDarkTheme ? "white" : "#333",
      marginBottom: 12,
    },
    modalMessage: {
      fontSize: 16,
      color: isDarkTheme ? "#bbb" : "#666",
      marginBottom: 20,
      lineHeight: 22,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    blockButton: {
      backgroundColor: isDarkTheme ? "#4797C8" : "#4797C8",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      flex: 1,
      marginRight: 8,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: isDarkTheme ? "#444" : "#ccc",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      flex: 1,
      alignItems: "center",
      display: "flex",
      justifyContent: "center"
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    cancelText: {
      color: isDarkTheme ? "white" : "#2f2f2f",
      fontSize: 16,
      fontWeight: "600",
    },
    instructionContainer: {
      marginTop: 24,
    },
    instructionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: isDarkTheme ? "white" : "#333",
    },
    instructionText: {
      fontSize: 14,
      color: isDarkTheme ? "#bbb" : "#666",
      marginBottom: 6,
      lineHeight: 20,
    },
  });
};

export default BlockUserModal;
