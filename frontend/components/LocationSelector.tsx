import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { locations } from "./mockData";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "@/hooks/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export interface Location {
  label: string;
  value: string;
}

interface LocationSelectorProps {
  startLocation: Location | null;
  endLocation: Location | null;
  setStartLocation: (location: Location | null) => void;
  setEndLocation: (location: Location | null) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  startLocation,
  endLocation,
  setStartLocation,
  setEndLocation,
}) => {
  const { t } = useTranslation();
  const { isThemeWhite } = useAuth();
  const isDarkTheme = !isThemeWhite;
  const styles = getStyles(isDarkTheme);
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const [isEndModalVisible, setIsEndModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Location | null>(null);
  const locationsList = locations();
  const filteredLocations = locationsList.filter((location) =>
    location.label.toLowerCase().includes(searchValue.toLowerCase())
  );
  const countries = locationsList
    .filter((loc) => loc.type === "country")
    .filter((location) =>
      location.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  const cities = selectedCountry
    ? locationsList
        .filter(
          (loc) => loc.type === "city" && loc.country === selectedCountry.value
        )
        .filter((location) =>
          location.label.toLowerCase().includes(searchValue.toLowerCase())
        )
    : [];

  const handleSelectLocation = (location: Location, type: "start" | "end") => {
    if (type === "start") {
      if (!selectedCountry) {
        setSelectedCountry(location);
        return;
      }
      setStartLocation(location);
      setSelectedCountry(null);
    } else if (type === "end") {
      if (!selectedCountry) {
        setSelectedCountry(location);
        return;
      }
      setEndLocation(location);
      setSelectedCountry(null);
    }
    setIsStartModalVisible(false);
    setIsEndModalVisible(false);
    if (searchValue !== "") {
      setSearchValue("");
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setIsStartModalVisible(true)}>
        <Text style={styles.label}>{t("startLocation")}*</Text>
        <View pointerEvents="none">
          <TextInput
            style={styles.input}
            placeholder={t("enterStartLocation")}
            placeholderTextColor={styles.placeholder.color}
            value={startLocation ? startLocation.label : ""}
            editable={false}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsEndModalVisible(true)}>
        <Text style={styles.label}>{t("endLocation")}*</Text>
        <View pointerEvents="none">
          <TextInput
            style={styles.input}
            placeholder={t("enterEndLocation")}
            placeholderTextColor={styles.placeholder.color}
            value={endLocation ? endLocation.label : ""}
            editable={false}
          />
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={isStartModalVisible}
        onRequestClose={() => setIsStartModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsStartModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.drawer,
                  Platform.OS === "ios"
                    ? { minHeight: 500 }
                    : { maxHeight: "80%" },
                ]}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {selectedCountry && (
                    <TouchableOpacity onPress={() => setSelectedCountry(null)}>
                      <Icon
                        name="arrow-back"
                        size={25}
                        style={{ marginBottom: 10 }}
                        color={isDarkTheme ? "#E0E0E0" : "#333"}
                      />
                    </TouchableOpacity>
                  )}
                  <View
                    style={[
                      styles.searchContainer,
                      selectedCountry && { width: "90%" },
                    ]}
                  >
                    <Icon
                      name="search"
                      size={20}
                      color={isDarkTheme ? "#E0E0E0" : "#333"}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      value={searchValue}
                      onChangeText={setSearchValue}
                      placeholder={t("searchStartLocation")}
                      placeholderTextColor={styles.placeholder.color}
                      style={styles.searchInput}
                    />
                  </View>
                </View>

                {filteredLocations.length > 0 ? (
                  <FlatList
                    data={!selectedCountry ? countries : cities}
                    keyExtractor={(item, index) => `${item.value}-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.locationItem}
                        onPress={() => handleSelectLocation(item, "start")}
                      >

                       {item?.value === "airports" ? (
                        <View style={styles.icon}>
                          <Ionicons name="airplane" size={20} color="#2f2f2f" />
                        </View>
                       ) : (
                        <View style={styles.icon}>
                        <Icon name="place" size={25} color="#2f2f2f" />
                      </View>
                       )}
                        <Text style={styles.locationText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={styles.locationList}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  />
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      {t("noResultsFound")}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        animationType="fade"
        visible={isEndModalVisible}
        onRequestClose={() => setIsEndModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsEndModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.drawer,
                  Platform.OS === "ios"
                    ? { minHeight: 500 }
                    : { maxHeight: "80%" },
                ]}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {selectedCountry && (
                    <TouchableOpacity onPress={() => setSelectedCountry(null)}>
                      <Icon
                        name="arrow-back"
                        size={25}
                        style={{ marginBottom: 10 }}
                        color={isDarkTheme ? "#E0E0E0" : "#333"}
                      />
                    </TouchableOpacity>
                  )}
                  <View
                    style={[
                      styles.searchContainer,
                      selectedCountry && { width: "90%" },
                    ]}
                  >
                    <Icon
                      name="search"
                      size={20}
                      color={isDarkTheme ? "#E0E0E0" : "#333"}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      value={searchValue}
                      onChangeText={setSearchValue}
                      placeholder={t("searchEndLocation")}
                      placeholderTextColor={styles.placeholder.color}
                      style={styles.searchInput}
                    />
                  </View>
                </View>
                {filteredLocations.length > 0 ? (
                  <FlatList
                    data={!selectedCountry ? countries : cities}
                    keyExtractor={(item, index) => `${item.value}-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.locationItem}
                        onPress={() => handleSelectLocation(item, "end")}
                      >
                         {item?.value === "airports" ? (
                        <View style={styles.icon}>
                          <Ionicons name="airplane" size={20} color="#2f2f2f" />
                        </View>
                       ) : (
                        <View style={styles.icon}>
                        <Icon name="place" size={25} color="#2f2f2f" />
                      </View>
                       )}
                        <Text style={styles.locationText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={styles.locationList}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  />
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      {t("noResultsFound")}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
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
      backgroundColor: isDarkTheme ? "rgb(31, 31, 31)" : "#fff",
      padding: 20,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      elevation: 5,
      shadowColor: isDarkTheme ? "#000" : "#ccc",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      color: isDarkTheme ? "white" : "#333",
    },
    locationItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      paddingHorizontal: 0,
      borderRadius: 8,
      backgroundColor: isDarkTheme ? "rgb(44, 44, 46)" : "#fff",
      marginBottom: 5,
      borderColor: isDarkTheme ? "#444" : "#E0E0E0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    locationText: {
      fontSize: 16,
      color: isDarkTheme ? "white" : "#333",
      marginLeft: 10,
    },
    locationList: {
      maxHeight: 400,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDarkTheme ? "#E0E0E0" : "#333333",
    },
    input: {
      backgroundColor: isDarkTheme ? "#1F1F1F" : "#FFFFFF",
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
      borderColor: isDarkTheme ? "#444" : "#E0E0E0",
      borderWidth: 1,
      color: isDarkTheme ? "white" : "#333333",
    },
    placeholder: {
      color: isDarkTheme ? "white" : "#999999",
    },
    noResultsContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
    },
    noResultsText: {
      fontSize: 16,
      color: "#333",
    },
    icon: {
      width: 30,
      height: 30,
      backgroundColor: "rgb(239 239 239)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
    },
  });

export default LocationSelector;
