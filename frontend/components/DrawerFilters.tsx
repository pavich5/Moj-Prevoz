import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import { styles as createStyles } from "@/assets/styles/HomeStyles";
import { useTranslation } from "react-i18next";
import { locations } from "./mockData";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/hooks/AuthContext";
import { Location } from "./LocationSelector";
import Ionicons from "react-native-vector-icons/Ionicons";
interface Option {
  label: string;
  value: string;
}

interface BottomDrawerProps {
  isModalVisible: boolean;
  selectedFilter: string | null;
  selectedTime: string | null;
  handleTimeChange: (time: string) => void;
  handleApplyTimeFilter: (time: string) => void;
  handleCancel: () => void;
  setSelectedSeats: (seats: string) => void;
  setSelectedStartLocation: (location: string) => void;
  setSelectedEndLocation: (location: string) => void;
  setSelectedNeed: (need: string) => void;
  closeModal: () => void;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  isModalVisible,
  selectedFilter,
  selectedTime,
  handleTimeChange,
  handleApplyTimeFilter,
  handleCancel,
  setSelectedSeats,
  setSelectedStartLocation,
  setSelectedEndLocation,
  setSelectedNeed,
  closeModal,
}) => {
  const { isThemeWhite } = useAuth();
  const { t } = useTranslation();
  const styles = createStyles(!isThemeWhite);
  const locationsList = locations();
  const [selectedCountry, setSelectedCountry] = useState<Location | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [latestArrivalTimeDateFormat, setLatestArrivalTimeDateFormat] =
    useState(() => {
      const defaultTime = new Date();
      defaultTime.setHours(10, 0, 0, 0);
      return defaultTime;
    });

  const seatOptions: Option[] = [
    { label: t("bottomDrawer.seatOption1"), value: "1" },
    { label: t("bottomDrawer.seatOption2"), value: "2" },
    { label: t("bottomDrawer.seatOption3"), value: "3" },
    { label: t("bottomDrawer.seatOption4"), value: "4" },
    { label: t("bottomDrawer.seatOptionMore"), value: "5" },
  ];
  const countries = locationsList
    .filter((loc) => loc.type === "country")
    .filter((location) =>
      location.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  const cities = selectedCountry
    ? locationsList
        .filter(
          (loc) => loc.type === "city" && loc.country === selectedCountry?.value
        )
        .filter((location) =>
          location.label.toLowerCase().includes(searchValue.toLowerCase())
        )
    : [];
  const options: Option[] =
    selectedFilter === "seats"
      ? seatOptions
      : selectedFilter === "startLocation" || selectedFilter === "endLocation"
      ? !selectedCountry
        ? countries
        : cities
      : selectedFilter === "need"
      ? [
          { label: t("bottomDrawer.needRide"), value: "ride" },
          { label: t("bottomDrawer.needDelivery"), value: "delivery" },
        ]
      : [];

  const handleApplySelection = (option: Option) => {
    if (selectedFilter === "seats") {
      setSelectedSeats(option.value);
      closeModal();
      return;
    }

    if (selectedFilter === "startLocation") {
      if (!selectedCountry) {
        setSelectedCountry(option);
        return;
      }
      setSelectedStartLocation(option.value);
      setSelectedCountry(null);
      closeModal();
      return;
    }

    if (selectedFilter === "endLocation") {
      if (!selectedCountry) {
        setSelectedCountry(option);
        return;
      }
      setSelectedEndLocation(option.value);
      setSelectedCountry(null);
      closeModal();
      return;
    }

    if (selectedFilter === "need") {
      setSelectedNeed(option.value);
      closeModal();
      return;
    }
  };

  return (
    <>
      {Platform.OS === "android" && selectedFilter === "time" ? (
        <DateTimePicker
          value={latestArrivalTimeDateFormat}
          mode="time"
          is24Hour={true}
          display="default"
          textColor="black"
          themeVariant={isThemeWhite ? "light" : "dark"}
          accentColor="#4797C8"
          onChange={(event, selectedTime) => {
            closeModal();
            if (selectedTime) {
              setLatestArrivalTimeDateFormat(selectedTime);
            }
            if (event.type === "set") {
              handleApplyTimeFilter(
                //@ts-ignore
                selectedTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              );
            } else {
              closeModal();
            }
          }}
        />
      ) : (
        <Modal
          visible={selectedFilter === "time" && Platform.OS === "ios"}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            closeModal();
          }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              closeModal();
            }}
          >
            <View style={styles.modalContainerTimeFilter}>
              <View style={Platform.OS === "ios" && styles.pickerContainerTime}>
                <DateTimePicker
                  value={latestArrivalTimeDateFormat}
                  mode="time"
                  is24Hour={true}
                  textColor={!isThemeWhite ? "white" : "black"}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedTime) => {
                    if (selectedTime) {
                      setLatestArrivalTimeDateFormat(selectedTime);
                    }
                    if (Platform.OS === "android") {
                      if (event.type === "set") {
                        handleApplyTimeFilter(
                          //@ts-ignore
                          selectedTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                        );
                      } else {
                        closeModal();
                      }
                    }
                  }}
                />
                {Platform.OS === "ios" && (
                  <View style={styles.buttonContainerTime}>
                    <TouchableOpacity
                      style={styles.confirmButtonTimeFilter}
                      onPress={() => {
                        handleTimeChange(
                          latestArrivalTimeDateFormat.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                        );
                        handleApplyTimeFilter(
                          latestArrivalTimeDateFormat.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                        );
                        closeModal();
                      }}
                    >
                      <Text style={styles.buttonText}>
                        {t("editPost.save")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible && selectedFilter !== "time"}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            closeModal();
            setSelectedCountry(null);
            setSearchValue("");
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.drawer, { minHeight: 350 }]}
          >
            {selectedFilter === "seats" && (
              <View>
                <FlatList
                  data={options}
                  keyExtractor={(item, index) => `${item.value}-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.drawerItem}
                      onPress={() => handleApplySelection(item)}
                    >
                      <Text style={styles.drawerItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: 400 }}
                />
              </View>
            )}

            {selectedFilter === "startLocation" && (
              <View
                //@ts-ignore
                style={{
                  minHeight: Platform.OS === "ios" ? 450 : 350,
                  maxHeight: Platform.OS === "android" && 400,
                }}
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
                        color={!isThemeWhite ? "#E0E0E0" : "#333"}
                      />
                    </TouchableOpacity>
                  )}
                  <View
                    style={[
                      styles.searchContainerLocation,
                      { width: selectedCountry ? "90%" : "100%" },
                    ]}
                  >
                    <Feather
                      name="search"
                      size={18}
                      color="#999"
                      style={styles.searchIcon}
                    />
                    <TextInput
                      value={searchValue}
                      style={[styles.searchInput, { flex: 1, color: isThemeWhite ? "#333" : "rgb(224, 224, 224)" }]}
                      placeholder={t("bottomDrawer.selectStartLocation")}
                      onChangeText={setSearchValue}
                      placeholderTextColor={
                        !isThemeWhite ? "rgb(224, 224, 224)" : "#333"
                      }
                    />
                  </View>
                </View>
                {options.length > 0 ? (
                  <FlatList
                    data={options}
                    keyExtractor={(item, index) => `${item.value}-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.drawerItem}
                        onPress={() => handleApplySelection(item)}
                      >
                        {item?.value === "airports" ? (
                          <View style={styles.icon}>
                            <Ionicons
                              name="airplane"
                              size={20}
                              color="#2f2f2f"
                            />
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
                    style={{ maxHeight: 400 }}
                  />
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={[styles.noResultsText, {color: isThemeWhite ? "#333" : "rgb(224, 224, 224)"}] }>
                      {t("noResultsFound")}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {selectedFilter === "endLocation" && (
              <View
                //@ts-ignore
                style={{
                  minHeight: Platform.OS === "ios" ? 450 : 350,
                  maxHeight: Platform.OS === "android" && 400,
                }}
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
                        color={!isThemeWhite ? "#E0E0E0" : "#333"}
                      />
                    </TouchableOpacity>
                  )}
                  <View
                    style={[
                      styles.searchContainerLocation,
                      { width: selectedCountry ? "90%" : "100%" },
                    ]}
                  >
                    <Feather
                      name="search"
                      size={18}
                      color="#999"
                      style={styles.searchIcon}
                    />
                    <TextInput
                      value={searchValue}
                      style={[styles.searchInput, { flex: 1, color: isThemeWhite ? "#333" : "rgb(224, 224, 224)" }]}
                      placeholder={t("bottomDrawer.selectEndLocation")}
                      onChangeText={setSearchValue}
                      placeholderTextColor={
                        !isThemeWhite ? "rgb(224, 224, 224)" : "#333"
                      }
                    />
                  </View>
                </View>
                {options.length > 0 ? (
                  <FlatList
                    data={options}
                    keyExtractor={(item, index) => `${item.value}-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.drawerItem}
                        onPress={() => handleApplySelection(item)}
                      >
                        {item?.value === "airports" ? (
                          <View style={styles.icon}>
                            <Ionicons
                              name="airplane"
                              size={20}
                              color="#2f2f2f"
                            />
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
                    style={{ maxHeight: 400 }}
                  />
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={[styles.noResultsText, {color: isThemeWhite ? "#333" : "rgb(224, 224, 224)"}] }>
                    {t("noResultsFound")}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {selectedFilter === "need" &&
              options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.drawerItem}
                  onPress={() => handleApplySelection(option)}
                >
                  <Text style={styles.drawerItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default BottomDrawer;
