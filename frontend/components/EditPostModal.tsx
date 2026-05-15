import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { getStyles } from "@/assets/styles/MyPostsStyles";
import { Post } from "@/assets/types/types";
import { CustomCheckbox } from "./CustomCheckbox";
import { useTranslation } from "react-i18next";
import MultiLocationSelector from "./MultiLocationSelector";
import LocationSelector from "./LocationSelector";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/hooks/AuthContext";

interface EditPostModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  updatedPost: Post | null;
  handleInputChange: (field: keyof Post, value: string) => void;
  handleCheckboxChange: (value: boolean) => void;
  handleSave: () => void;
  handleDateChange: (value: Date) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  updatedPost,
  handleInputChange,
  handleCheckboxChange,
  handleSave,
  handleDateChange,
}) => {
  const { t } = useTranslation();
  const { isThemeWhite } = useAuth();
  const styles = getStyles(isThemeWhite ? "light" : "dark");
  const [isTimeSelectVisible, setIsTimeSelectVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState(() => {
    const defaultTime = new Date();
    defaultTime.setHours(10, 0, 0, 0);
    return defaultTime;
  });

  if (!updatedPost) return null;
  const startLocation = {
    label: updatedPost.startingLocation,
    value: updatedPost.startingLocation,
  };
  const endLocation = {
    label: updatedPost.endLocation,
    value: updatedPost.endLocation,
  };

  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split(".").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleConfirmDate = () => {
    if (tempSelectedDate) {
      handleDateChange(tempSelectedDate);
    }
    setShowDatePicker(false);
  };

  const handleConfirmTimeSelect = (selectedTime: Date) => {
    setIsTimeSelectVisible(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
      handleInputChange(
        "time",
        selectedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }
  };
  return (
    <>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        {Platform.OS === "android" && isTimeSelectVisible && (
          <DateTimePicker
            textColor="black"
            themeVariant={isThemeWhite ? "light" : "dark"}
            accentColor="#4797C8"
            value={
              updatedPost.time
                ? (() => {
                    const [hours, minutes] = updatedPost.time
                      .split(":")
                      .map(Number);
                    const defaultDate = new Date();
                    defaultDate.setHours(hours, minutes, 0, 0);
                    return defaultDate;
                  })()
                : selectedTime
            }
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              if (event.type === "set" && selectedTime) {
                setIsTimeSelectVisible(false);
                setSelectedTime(selectedTime);
                handleInputChange(
                  "time",
                  selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                );
              } else {
                setIsTimeSelectVisible(false);
              }
            }}
          />
        )}
        {Platform.OS === "ios" && (
          <Modal
            visible={isTimeSelectVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsTimeSelectVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setIsTimeSelectVisible(false)}>
            <View style={styles.modalContainerTime}>
              <View style={Platform.OS === "ios" && styles.pickerContainerTime}>
                <DateTimePicker
                  value={
                    updatedPost.time
                      ? (() => {
                          const [hours, minutes] = updatedPost.time
                            .split(":")
                            .map(Number);
                          const defaultDate = new Date();
                          defaultDate.setHours(hours, minutes, 0, 0);
                          return defaultDate;
                        })()
                      : selectedTime
                  }
                  mode="time"
                  is24Hour={true}
                  textColor={!isThemeWhite ? "white" : "black"}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedTime) => {
                    if (selectedTime) {
                      setSelectedTime(selectedTime);
                      handleInputChange(
                        "time",
                        selectedTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      );
                    }
                  }}
                />

                <View style={styles.buttonContainerTime}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => handleConfirmTimeSelect(selectedTime)}
                  >
                    <Text style={styles.buttonText}>{t("editPost.save")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <LocationSelector
                startLocation={startLocation}
                endLocation={endLocation}
                setStartLocation={(value) =>
                  handleInputChange("startingLocation", value?.value ?? "")
                }
                setEndLocation={(value) =>
                  handleInputChange("endLocation", value?.value ?? "")
                }
              />
              {updatedPost.type === "passenger" && (
                <>
                  <Text style={styles.label}>{t("seatsNeeded")}:</Text>
                  <TextInput
                    maxLength={2}
                    style={styles.input}
                    value={updatedPost.seatsNeeded?.toString()}
                    onChangeText={(text) =>
                      handleInputChange("seatsNeeded", text)
                    }
                    placeholder={t("enterSeatsNeeded")}
                    keyboardType="numeric"
                  />
                </>
              )}
              {updatedPost.type === "driver" && (
                <>
                  <Text style={styles.label}>{t("editPost.freeSeats")}:</Text>
                  <TextInput
                    maxLength={2}
                    style={styles.input}
                    value={updatedPost.seatsAvailable?.toString()}
                    onChangeText={(text) =>
                      handleInputChange("seatsAvailable", text)
                    }
                    placeholder={t("editPost.enterFreeSeats")}
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>
                    {t("editPost.pickupLocation")}:
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={updatedPost.pickUpLocation}
                    onChangeText={(text) =>
                      handleInputChange("pickUpLocation", text)
                    }
                    placeholder={t("editPost.enterPickupLocation")}
                  />
                  <MultiLocationSelector
                    stopByLocations={updatedPost.stopByLocations ?? ""}
                    setStopByLocations={(value) =>
                      handleInputChange("stopByLocations", value)
                    }
                  />
                </>
              )}

              <Text style={styles.label}>{t("editPost.price")}:</Text>
              <TextInput
                maxLength={4}
                style={styles.input}
                value={updatedPost.price?.toString()}
                onChangeText={(text) => handleInputChange("price", text)}
                placeholder={t("editPost.enterPrice")}
                keyboardType="numeric"
              />
              <Text style={styles.label}>{t("phoneNumber")}:</Text>
              <TextInput
                style={styles.input}
                value={updatedPost.phoneNumber?.toString()}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                placeholder={t("contactNumberPlaceholder")}
                keyboardType="numeric"
                maxLength={13}
              />
              {updatedPost.type === "passenger" && (
                <>
                  <Text style={styles.label}>{t("editPost.luggage")}:</Text>
                  <TextInput
                    style={styles.input}
                    value={updatedPost.luggage ?? ""}
                    onChangeText={(text) => handleInputChange("luggage", text)}
                    placeholder={t("editPost.enterLuggage")}
                  />
                </>
              )}
              <View style={styles.datePickerContainer}>
                <Text style={styles.createDateText}>{t("pickupTime")}:</Text>
                <TouchableOpacity
                  onPress={() => setIsTimeSelectVisible(true)}
                  style={styles.datePickerInput}
                >
                  <Text style={styles.datePickerText}>{updatedPost.time}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerContainer}>
                <Text style={styles.createDateText}>{t("date")}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setTempSelectedDate(parseDate(updatedPost.date));
                    setShowDatePicker(true);
                  }}
                  style={styles.datePickerInput}
                >
                  <Text style={styles.datePickerText}>{updatedPost.date}</Text>
                </TouchableOpacity>

                {showDatePicker &&
                  (Platform.OS === "ios" ? (
                    <Modal transparent={true} animationType="fade">
                      <TouchableWithoutFeedback
                        onPress={() => setShowDatePicker(false)}
                      >
                        <View style={styles.modalBackground}>
                          <View style={styles.pickerContainer}>
                            <DateTimePicker
                              value={parseDate(updatedPost.date) || new Date()}
                              mode="date"
                              textColor={!isThemeWhite ? "white" : "black"}
                              display="spinner"
                              onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                  setTempSelectedDate(selectedDate);
                                }
                              }}
                            />
                            <TouchableOpacity
                              onPress={handleConfirmDate}
                              style={styles.doneButton}
                            >
                              <Text style={{ color: "white" }}>
                                {t("done")}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </Modal>
                  ) : (
                    <DateTimePicker
                      value={parseDate(updatedPost.date) || new Date()}
                      mode="date"
                      textColor="black"
                      themeVariant={isThemeWhite ? "light" : "dark"}
                      accentColor="#4797C8"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          handleDateChange(selectedDate);
                        }
                      }}
                    />
                  ))}
              </View>
              {updatedPost.type === "passenger" && (
                <CustomCheckbox
                  text={t("editPost.showPrice")}
                  value={updatedPost.showPrice ?? false}
                  onValueChange={handleCheckboxChange}
                />
              )}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{t("editPost.save")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {t("editPost.cancel")}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditPostModal;
