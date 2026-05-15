import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useTranslation } from "react-i18next";
import { locations } from "./mockData";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "@/hooks/AuthContext";

interface Location {
  label: string;
  value: string;
}

interface MultiLocationSelectorProps {
  stopByLocations: string;
  setStopByLocations: (locations: string) => void;
}

const MultiLocationSelector: React.FC<MultiLocationSelectorProps> = ({
  stopByLocations,
  setStopByLocations,
}) => {
  const { t } = useTranslation();
  const { isThemeWhite } = useAuth();
  const isDarkTheme = !isThemeWhite;
  const locationsList = locations();
  const styles = getStyles(isDarkTheme);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);

  const handleSelectLocation = (location: Location) => {
    if (selectedLocations.some((loc) => loc.value === location.value)) {
      setSelectedLocations((prevLocations) =>
        prevLocations.filter((loc) => loc.value !== location.value)
      );
    } else {
      setSelectedLocations((prevLocations) => [...prevLocations, location]);
    }
  };
  const filteredLocations = locationsList.filter((location) =>
    location.label.toLowerCase().includes(searchValue.toLowerCase())
  );
  const handleConfirmSelection = () => {
    const selectedLocationLabels = selectedLocations.map((loc) => loc.value);
    setStopByLocations(selectedLocationLabels.join(", "));
    setIsModalVisible(false);
    setSearchValue("");
  };

  const isSelected = (location: Location) =>
    selectedLocations.some((loc) => loc.value === location.value);

  useEffect(() => {
    if (stopByLocations) {
      const preselectedLocations = stopByLocations
        .split(", ")
        .map((label) => locationsList.find((loc) => loc.label === label))
        .filter((loc) => loc !== undefined) as Location[];
      setSelectedLocations(preselectedLocations);
    } else {
      setSelectedLocations([]);
    }
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View>
          <Text style={styles.label}>{t("stopByLocations")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("enterStopByLocations")}
            placeholderTextColor={styles.placeholder.color}
            value={stopByLocations}
            editable={false}
            onTouchStart={() => setIsModalVisible(true)}
          />
        </View>
      </TouchableOpacity>

      <Modal transparent={true} animationType="fade" visible={isModalVisible}>
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
        <View
          style={[
            styles.modalContainer,
            Platform.OS === "ios"
              && { minHeight: 400, maxHeight: 850 }
          ]}
        >
          <View style={styles.drawer}>
            <TextInput
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder={t("searchStopByLocations")}
              placeholderTextColor={styles.placeholder.color}
              style={styles.searchInput}
            />
            <FlatList
              data={filteredLocations}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.locationItem,
                    isSelected(item) && styles.selectedLocationItem,
                  ]}
                  onPress={() => handleSelectLocation(item)}
                >
                  <Text style={styles.locationText}>{item.label}</Text>
                  {isSelected(item) && (
                    <Icon name="checkmark" size={20} color="green" />
                  )}
                </TouchableOpacity>
              )}
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={[
                styles.locationList,
                Platform.OS === "ios" ? { minHeight: 300 } : { maxHeight: 200},
              ]}
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmSelection}
            >
              <Text style={styles.confirmButtonText}>
                {t("confirmSelection")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const getStyles = (isDarkTheme: boolean) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    drawer: {
      backgroundColor: isDarkTheme ? "#122" : "#fff",
      padding: 20,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      minHeight: 400,
    },
    closeButton: {
      position: "absolute",
      top: 10,
      right: 10,
      padding: 10,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: isDarkTheme ? "#666" : "#ccc",
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      marginTop: 25,
      color: isDarkTheme ? "#fff" : "#000",
      height: 45
    },
    columnWrapper: {
      justifyContent: "space-between",
    },
    locationItem: {
      padding: 10,
      marginBottom: 10,
      flex: 1,
      borderWidth: 1,
      borderColor: isDarkTheme ? "#666" : "#ccc",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    selectedLocationItem: {
      flexDirection: "row",
      backgroundColor: isDarkTheme ? "#333" : "#e0ffe0",
    },
    locationText: {
      color: isDarkTheme ? "#fff" : "#000",
    },
    locationList: {
      maxHeight: 300,
      marginTop: 15,
      marginBottom: 15,
    },
    confirmButton: {
      backgroundColor: isDarkTheme ? "#4797C8" : "#4797C8",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    confirmButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDarkTheme ? "#E0E0E0" : "#333333",
    },
    input: {
      backgroundColor: isDarkTheme ? "#1F1F1F" : "#FFFFFF",
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      borderColor: isDarkTheme ? "#444" : "#E0E0E0",
      borderWidth: 1,
      color: isDarkTheme ? "#E0E0E0" : "#333333",
      height: 45
    },
    placeholder: {
      color: isDarkTheme ? "rgb(233 233 233)" : "#999999",
    },
  });

export default MultiLocationSelector;
