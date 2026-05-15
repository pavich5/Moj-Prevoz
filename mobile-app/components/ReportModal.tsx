import { useAuth } from "@/hooks/AuthContext";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ReportModal = ({
  visible,
  onClose,
  onSubmit,
  title,
  subtitle,
  placeholderText,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  title: string;
  subtitle: string;
  placeholderText: string;
}) => {
  const [reason, setReason] = useState("");
  const { isThemeWhite } = useAuth();
  const isDarkTheme = !isThemeWhite;
  const { t } = useTranslation();
  const handleReport = () => {
    if (reason.trim().length > 0) {
      onSubmit(reason);
      setReason("");
      onClose();
    } else {
      alert("Please provide a reason.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.overlay}>
          <View
            style={[styles.modalContainer, isDarkTheme && styles.modalContainerDark]}
          >
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={24}
                color={isDarkTheme ? "#fff" : "#2f2f2f"}
              />
            </TouchableOpacity>
            <Text style={[styles.title, isDarkTheme && styles.titleDark]}>
              {title}
            </Text>
            <Text style={[styles.subtitle, isDarkTheme && styles.subtitleDark]}>
              {subtitle}
            </Text>
            <TextInput
              style={[styles.input, isDarkTheme && styles.inputDark]}
              placeholder={placeholderText}
              placeholderTextColor={isDarkTheme ? "#777" : "#999"}
              value={reason}
              onChangeText={setReason}
              multiline
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleReport}
                style={[styles.submitButton, isDarkTheme && styles.submitButtonDark]}
              >
                <Text
                  style={[styles.submitButtonText, isDarkTheme && styles.submitButtonTextDark]}
                >
                  {t("submitReport")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.cancelButton, isDarkTheme && styles.cancelButtonDark]}
              >
                <Text
                  style={[styles.cancelButtonText, isDarkTheme && styles.cancelButtonTextDark]}
                >
                  {t("editPost.cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    elevation: 5,
  },
  modalContainerDark: {
    backgroundColor: "#333",
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitleDark: {
    color: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    color: "#000",
    backgroundColor: "#f9f9f9",
  },
  inputDark: {
    borderColor: "#555",
    color: "#fff",
    backgroundColor: "#444",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#4797C8",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  submitButtonDark: {
    backgroundColor: "#4797C8",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  submitButtonTextDark: {
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
    display: "flex",
    justifyContent: "center",
  },
  cancelButtonDark: {
    backgroundColor: "#555",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  cancelButtonTextDark: {
    color: "#fff",
  },
});

export default ReportModal;
