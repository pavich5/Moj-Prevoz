import React from "react";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { styles as createStyles } from "../assets/styles/CreatePostStyles";
import { useAuth } from "@/hooks/AuthContext";

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric";
  onClick?: () => void
  maxLength?: number
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  onClick,
  maxLength
}) => {
  const { isThemeWhite } = useAuth();
  const styles = createStyles(!isThemeWhite);

  return (
    <TouchableOpacity onPress={onClick}>
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength ?? 13}
      />
    </View>
    </TouchableOpacity>
  );
};

export default TextInputField;
