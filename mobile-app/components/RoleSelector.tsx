import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { styles as createStyles } from "../assets/styles/CreatePostStyles";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/AuthContext";

interface RoleSelectorProps {
  role: "Driver" | "Passenger";
  setRole: (role: "Driver" | "Passenger") => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ role, setRole }) => {
  const { isThemeWhite } = useAuth();
  const { t } = useTranslation();
  const styles = createStyles(!isThemeWhite);
  
  return (
    <View style={styles.segmentedControlContainer}>
      <TouchableOpacity
        style={[
          styles.segmentedControl,
          role === "Driver" && styles.segmentedControlActive,
        ]}
        onPress={() => setRole("Driver")}
      >
        <Text
          style={[
            styles.segmentedControlText,
            role === "Driver" && styles.segmentedControlTextActive,
          ]}
        >
          {t("driver")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.segmentedControl,
          role === "Passenger" && styles.segmentedControlActive,
        ]}
        onPress={() => setRole("Passenger")}
      >
        <Text
          style={[
            styles.segmentedControlText,
            role === "Passenger" && styles.segmentedControlTextActive,
          ]}
        >
          {t("passenger")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSelector;
