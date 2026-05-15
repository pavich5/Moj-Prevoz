import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { styles as createStyles } from "../assets/styles/CreatePostStyles";
import { useAuth } from "@/hooks/AuthContext";

interface TextInputFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
}

const SimpleInputFields: React.FC<TextInputFieldProps> = ({
  label,
  value,
  placeholder,
  onClick,
}) => {
  const { isThemeWhite } = useAuth();
  const styles = createStyles(!isThemeWhite);

  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <Text style={styles.placeholder}>
          {value || placeholder}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SimpleInputFields;
