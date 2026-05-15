import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles as createStyles } from "../assets/styles/CreatePostStyles";
import { useAuth } from "@/hooks/AuthContext";

interface CustomCheckboxProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  text: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  value,
  onValueChange,
  text,
}) => {
  const { isThemeWhite } = useAuth();
  const styles = createStyles(!isThemeWhite);

  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Text style={styles.checkmark}>✔</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{text}</Text>
    </TouchableOpacity>
  );
};
