import React from "react";
import { TextInput, Text, TouchableOpacity, View } from "react-native";
import { styles as createStyles } from "../assets/styles/CreatePostStyles";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/AuthContext";

interface PickUpLocationSectionProps {
  pickUpLocation: string;
  customPickUpDescription: string;
  setPickUpLocation: (location: string) => void;
  setCustomPickUpDescription: (description: string) => void;
  isCustomPickUpLocation: boolean
  setIsCustomPickUpLocation: (value: boolean) => void
}

const PickUpLocationSection: React.FC<PickUpLocationSectionProps> = ({
  pickUpLocation,
  customPickUpDescription,
  setPickUpLocation,
  setCustomPickUpDescription,
  isCustomPickUpLocation,
  setIsCustomPickUpLocation
}) => {
  const { isThemeWhite } = useAuth();
  const styles = createStyles(!isThemeWhite);
  const { t } = useTranslation();

  return (
    <View style={styles.pickUpLocationContainer}>
      <TouchableOpacity
        style={[
          styles.pickUpOption,
          !isCustomPickUpLocation && styles.pickUpOptionActive,
        ]}
        onPress={() => {
          setPickUpLocation("Home")
          setIsCustomPickUpLocation(false)
        }}
      >
        <Text
          style={[
            styles.pickUpText,
            !isCustomPickUpLocation && styles.pickUpTextActive,
          ]}
        >
          {t("pickUpLocation.home")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.pickUpOption,
          isCustomPickUpLocation && styles.pickUpOptionActive,
        ]}
        onPress={() => setIsCustomPickUpLocation(true)}
      >
        <Text
          style={[
            styles.pickUpText,
            isCustomPickUpLocation && styles.pickUpTextActive,
          ]}
        >
          {t("pickUpLocation.custom")}
        </Text>
      </TouchableOpacity>

      {isCustomPickUpLocation && (
        <TextInput
          style={styles.input}
          placeholder={t("pickUpLocation.customPlaceholder")}
          placeholderTextColor={styles.placeholder.color}
          value={customPickUpDescription}
          onChangeText={setCustomPickUpDescription}
        />
      )}
    </View>
  );
};

export default PickUpLocationSection;
