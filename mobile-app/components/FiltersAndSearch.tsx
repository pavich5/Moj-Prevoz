import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { styles as createStyles } from "@/assets/styles/HomeStyles";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/AuthContext";

interface FiltersAndSearchProps {
  openModal: (
    filterType: "time" | "seats" | "startLocation" | "need" | "endLocation"
  ) => void;
  selectedTime: string | null;
  selectedSeats: string | null;
  selectedNeed: string | null;
  startLocation: string | null;
  endLocation: string | null;
  resetFilters: () => void;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (value: Date | null) => void;
  setEndDate: (value: Date | null) => void;
}

const FiltersAndSearch: React.FC<FiltersAndSearchProps> = ({
  openModal,
  selectedTime,
  selectedSeats,
  selectedNeed,
  startLocation,
  endLocation,
  resetFilters,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const { isThemeWhite } = useAuth();
  const isDarkTheme = !isThemeWhite;
  const styles = createStyles(isDarkTheme || false);
  const { t, i18n } = useTranslation();
  const [tempStartDate, setTempStartDate] = useState(
    startDate ? new Date(startDate) : new Date()
  );
  const [tempEndDate, setTempEndDate] = useState(
    endDate ? new Date(endDate) : new Date()
  );
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);

  const showDatePicker = (type: "start" | "end") => {
    if (type === "start") {
      setOpenStartPicker(true);
    } else {
      setOpenEndPicker(true);
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
      >
        {Platform.OS === "ios" && openStartPicker && (
          <Modal
            visible={Platform.OS === "ios" && openStartPicker}
            transparent={true}
            animationType="fade"
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => {
                setOpenStartPicker(false);
              }}
            >
              <View style={styles.modalBackground}>
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={tempStartDate}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setTempStartDate(selectedDate);
                      }
                    }}
                    textColor={isDarkTheme ? "white" : "black"}
                    minimumDate={new Date(2024, 11, 16)}
                    maximumDate={new Date(2026, 11, 31)}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setStartDate(tempStartDate);
                      setOpenStartPicker(false);
                    }}
                    style={styles.doneButton}
                  >
                    <Text style={{ color: "white" }}>{t("done")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        {Platform.OS === "android" && openStartPicker && (
          <DateTimePicker
            value={tempStartDate || new Date()}
            mode="date"
            textColor="black"
            themeVariant={isThemeWhite ? "light" : "dark"}
            accentColor="#4797C8"
            display="default"
            minimumDate={new Date(2024, 11, 16)}
            maximumDate={new Date(2026, 11, 31)}
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                setOpenStartPicker(false);
                setTempStartDate(selectedDate);
                setStartDate(selectedDate);
              } else {
                setOpenStartPicker(false);
              }
            }}
          />
        )}

        {Platform.OS === "ios" && openEndPicker && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={Platform.OS === "ios" && openEndPicker}
          >
               <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setOpenEndPicker(false);
          }}
        >
            <View style={styles.modalBackground}>
              <View style={styles.pickerContainer}>  
                <DateTimePicker
                  textColor={isDarkTheme ? "white" : "black"}
                  value={tempEndDate}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date(2024, 11, 16)}
                  maximumDate={new Date(2026, 11, 31)}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setTempEndDate(selectedDate);
                    }
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    setEndDate(tempEndDate);
                    setOpenEndPicker(false);
                  }}
                  style={styles.doneButton}
                >
                  <Text style={{ color: "white" }}>{t("done")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            </TouchableOpacity>
          </Modal>
        )}

        {Platform.OS === "android" && openEndPicker && (
          <DateTimePicker
            themeVariant={isThemeWhite ? "light" : "dark"}
            accentColor="#4797C8"
            value={tempEndDate || new Date()}
            mode="date"
            textColor="black"
            display="default"
            minimumDate={new Date(2024, 11, 16)}
            maximumDate={new Date(2026, 11, 31)}
            onChange={(event, selectedDate) => {
              setOpenEndPicker(false);
              if (event.type === "set" && selectedDate) {
                setTempEndDate(selectedDate);
                setEndDate(selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => openModal("time")}
          style={styles.filterOption}
        >
          <Feather
            name="clock"
            size={17.5}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
          <Text style={styles.filterText}>
            {selectedTime ? selectedTime : t("filtersAndSearch.time")}
          </Text>
          <Feather
            name="chevron-down"
            size={16}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openModal("seats")}
          style={styles.filterOption}
        >
          <Feather
            name="users"
            size={17.5}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
          <Text style={styles.filterText}>
            {selectedSeats === "5"
              ? "5+"
              : selectedSeats
              ? selectedSeats
              : t("filtersAndSearch.seats")}
          </Text>
          <Feather
            name="chevron-down"
            size={16}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openModal("startLocation")}
          style={[
            styles.filterOption,
            {
              display: "flex",
              justifyContent: "center",
              maxWidth: 145,
            },
          ]}
        >
          <Feather
            name="map-pin"
            size={17.5}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
          <Text style={styles.filterText}>
            {startLocation ? startLocation : t("startLocationFilter")}
          </Text>
          <Feather
            name="chevron-down"
            size={16}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openModal("endLocation")}
          style={[
            styles.filterOption,
            {
              display: "flex",
              justifyContent: "center",
              maxWidth: 145,
            },
          ]}
        >
          <Feather
            name="map-pin"
            size={17.5}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
          <Text style={styles.filterText}>
            {endLocation ? endLocation : t("endLocation")}
          </Text>
          <Feather
            name="chevron-down"
            size={16}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openModal("need")}
          style={[
            styles.filterOption,
            {
              display: "flex",
              justifyContent: "center",
            },
          ]}
        >
          <Feather
            name="list"
            size={17.5}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
          <Text style={styles.filterText}>
            {selectedNeed === "ride"
              ? t("filtersAndSearch.ride")
              : selectedNeed === "delivery"
              ? t("filtersAndSearch.passenger")
              : t("filtersAndSearch.type")}
          </Text>
          <Feather
            name="chevron-down"
            size={16}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => showDatePicker("start")}
          style={[
            styles.filterOption,
            {
              display: "flex",
              justifyContent: "center",
              maxWidth: 120,
            },
          ]}
        >
          <Feather
            name="calendar"
            size={16}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
          <Text style={styles.filterText}>
            {startDate
              ? startDate.toLocaleDateString()
              : t("filtersAndSearch.startDate")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => showDatePicker("end")}
          style={[
            styles.filterOption,
            {
              display: "flex",
              justifyContent: "center",
              maxWidth: 120,
            },
          ]}
        >
          <Feather
            name="calendar"
            size={16}
            color={isDarkTheme ? "rgb(224, 224, 224)" : "#2E2E2E"}
          />
          <Text style={styles.filterText}>
            {endDate
              ? endDate.toLocaleDateString()
              : t("filtersAndSearch.endDate")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterOption,
            {
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#4797C8",
              minWidth: 90,
              padding: 0,
            },
          ]}
          onPress={resetFilters}
        >
          <Text style={[styles.filterText, { color: "white"}]}>
            {t("ResetFilters")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FiltersAndSearch;
