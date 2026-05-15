import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Platform } from "react-native";
import CustomSlider from "./CustomSlider"; 
import { useAuth } from "@/hooks/AuthContext";

interface SelectTimeProps {
  latestArrivalTime: string;
  isTimeSelectVisible: boolean;
  onClose: () => void;
  onTimeChange: (value: string) => void;
  text: string;
}

const SelectTime: React.FC<SelectTimeProps> = ({
  latestArrivalTime,
  isTimeSelectVisible,
  onClose,
  onTimeChange,
  text,
}) => {
  const { isThemeWhite } = useAuth();
  const [isEditing,setIsEditing] = useState(false)
  const dynamicStyles = styles(!isThemeWhite);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isTimeSelectVisible}
      onRequestClose={onClose}
    >
      <View style={[dynamicStyles.modalContainer,isEditing && Platform.OS === 'ios' && {marginBottom: 270}]}>
        <View style={dynamicStyles.modalContent}>
          <Text style={dynamicStyles.drawerTitle}>{text}</Text>
          <CustomSlider
            value={latestArrivalTime}
            onValueChange={onTimeChange}
            onApply={onClose}
            onCancel={onClose}
            setIsEditing={setIsEditing}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = (isDarkTheme: boolean) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: isDarkTheme ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: isDarkTheme ? "#122" : "white", 
    padding: 20,
    height: 400,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: isDarkTheme ? "white" : "black",
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
    backgroundColor: isDarkTheme ? "rgb(0, 0, 0)" : "#4797C8",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SelectTime;
