import React from "react";
import { TextInput, Text, TouchableOpacity, View } from "react-native";
import { styles as createStyles } from "../assets/styles/CreatePostStyles";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/AuthContext";

interface LuggageSectionProps {
  hasLuggage: boolean;
  luggageDescription: string;
  setHasLuggage: (hasLuggage: boolean) => void;
  setLuggageDescription: (description: string) => void;
}

const LuggageSection: React.FC<LuggageSectionProps> = ({
  hasLuggage,
  luggageDescription,
  setHasLuggage,
  setLuggageDescription,
}) => {
  const { isThemeWhite } = useAuth();
  const { t } = useTranslation(); 
  const styles = createStyles(!isThemeWhite);

  return (
    <View style={styles.luggageContainer}>
      <TouchableOpacity
        style={[
          styles.luggageToggle,
          hasLuggage && styles.luggageToggleActive,
        ]}
        onPress={() => setHasLuggage(!hasLuggage)}
      >
        <Text
          style={[
            styles.luggageText,
            hasLuggage && styles.luggageTextActive,
          ]}
        >
          {hasLuggage ? t("luggageYes") : t("luggageNo")}
        </Text>
      </TouchableOpacity>

      {hasLuggage && (
        <TextInput
          style={styles.input}
          placeholder={t("luggageDescriptionPlaceholder")} 
          placeholderTextColor={styles.placeholder.color}
          value={luggageDescription}
          onChangeText={setLuggageDescription}
        />
      )}
    </View>
  );
};

export default LuggageSection;
