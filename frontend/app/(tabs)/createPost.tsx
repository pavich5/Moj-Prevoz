import React, { useState } from "react";
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
  View,
  Platform,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { styles as createStyles } from "../../assets/styles/CreatePostStyles";
import PickUpLocationSection from "@/components/PickUpLocationSection";
import RoleSelector from "@/components/RoleSelector";
import TextInputField from "@/components/TextInputField";
import LuggageSection from "@/components/LuggageSection";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { createPost } from "@/components/callApi";
import { useTranslation } from "react-i18next";
import LocationSelector from "@/components/LocationSelector";
import MultiLocationSelector from "@/components/MultiLocationSelector";
import { useAuth } from "@/hooks/AuthContext";
import SimpleInputFields from "@/components/SimpleInputFields";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "./AllPosts";
import { Filter } from "bad-words";

interface Location {
  label: string;
  value: string;
}

export const validateDate = (date: string) => {
  const datePattern = /^([0-2]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
  return datePattern.test(date);
};

export const validateTime = (time: string) => {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timePattern.test(time);
};

export const isValidPhoneNumber = (phoneNumber: string) => {
  const phoneRegex = /^(?:\+389|0)(?:\s?\d{2,3})(?:\s?\d{3})(?:\s?\d{3})$/;
  return phoneRegex.test(phoneNumber);
};

export default function CreatePostScreen() {
  const { userId, userDetails, isThemeWhite } = useAuth();
  const { t } = useTranslation();
  const filter = new Filter();
  const [role, setRole] = useState<"Driver" | "Passenger">("Driver");

  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [pickUpLocation, setPickUpLocation] = useState("Home");
  const [customPickUpDescription, setCustomPickUpDescription] = useState("");
  const [isCustomPickUpLocation, setIsCustomPickUpLocation] = useState(false);
  const [canStopBy, setCanStopBy] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(true);
  const [stopByLocations, setStopByLocations] = useState("");

  const [freeSeats, setFreeSeats] = useState("");
  const [passengerFreeSeats, setPassengerFreeSeats] = useState("1");

  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [isTimeSelectVisable, setIsTimeSelectVisable] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTimeDateFormat, setSelectedTimeDateFormat] = useState(() => {
    const defaultTime = new Date();
    defaultTime.setHours(10, 0, 0, 0);
    return defaultTime;
  });

  const [hasLuggage, setHasLuggage] = useState(false);
  const [luggageDescription, setLuggageDescription] = useState("");

  const [price, setPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showPrice, setShowPrice] = useState(false);

  const [contactPhoneNumber, setContactPhoneNumber] = useState<string | null>(
    String(userDetails?.phoneNumber)
  );

  const styles = createStyles(!isThemeWhite);

  const resetForm = () => {
    setRole("Driver");
    setStartLocation(null);
    setEndLocation(null);
    setFreeSeats("");
    setDate(null);
    setHasLuggage(false);
    setLuggageDescription("");
    setPickUpLocation("Home");
    setCustomPickUpDescription("");
    setSelectedTime("");
    setCanStopBy(false);
    setStopByLocations("");
    setPrice("");
    setMaxPrice("");
    setShowPrice(false);
  };
  const handlePhoneNumberChange = (text: string) => {
    if (text.startsWith("0")) {
      setContactPhoneNumber("+389" + text.slice(1));
    } else {
      setContactPhoneNumber(text);
    }
  };
  const handleSubmit = async () => {
    if (
      !startLocation ||
      !endLocation ||
      (showPhoneNumber && !contactPhoneNumber)
    ) {
      Alert.alert(t("missingFields"), t("fillRequiredFields"));
      return;
    }

    if (
      showPhoneNumber &&
      contactPhoneNumber &&
      !isValidPhoneNumber(contactPhoneNumber)
    ) {
      Alert.alert(
        t("invalidPhoneNumber"),
        t("pleaseEnterValidMacedonianPhoneNumber")
      );
      return;
    }
    if (!date) {
      Alert.alert(t("invalidDate"), t("enterValidDate"));
      return;
    }

    const formattedDate = formatDate(date);
    if (role === "Driver") {
      if (
        !formattedDate ||
        !freeSeats ||
        !price ||
        !validateTime(selectedTime) ||
        (isCustomPickUpLocation && customPickUpDescription === "")
      ) {
        Alert.alert(
          t("missingOrInvalidFields"),
          t("ensureAllDriverFieldsValid")
        );
        return;
      }
      if (
        isCustomPickUpLocation &&
        filter.isProfane(customPickUpDescription.trim().toLowerCase())
      ) {
        Alert.alert(
          "Invalid Input",
          "Please avoid using inappropriate language."
        );
        return;
      }

      if (isNaN(Number(price))) {
        Alert.alert(t("invalidPrice"), t("enterValidPrice"));
        return;
      }
      if (isNaN(Number(freeSeats)) || Number(freeSeats) <= 0) {
        Alert.alert(t("invalidFreeSeats"), t("enterValidFreeSeats"));
        return;
      }
    } else {
      if (
        !selectedTime ||
        !maxPrice ||
        !validateTime(selectedTime) ||
        !passengerFreeSeats ||
        (hasLuggage && luggageDescription.length <= 0)
      ) {
        Alert.alert(
          t("missingOrInvalidFields"),
          t("ensureAllPassengerFieldsFilled")
        );
        return;
      }

      if (
        hasLuggage &&
        filter.isProfane(luggageDescription.trim().toLowerCase())
      ) {
        Alert.alert(
          "Invalid Input",
          "Please avoid using inappropriate language."
        );
        return;
      }

      if (isNaN(Number(maxPrice))) {
        Alert.alert(t("invalidMaxPrice"), t("enterValidMaxPrice"));
        return;
      }

      if (
        isNaN(Number(passengerFreeSeats)) ||
        Number(passengerFreeSeats) <= 0
      ) {
        Alert.alert(t("invalidNeededSeats"), t("enterValidNeededSeats"));
        return;
      }
    }

    const postData = {
      startingLocation: startLocation.value,
      endLocation: endLocation.value,
      userId: Number(userId),
      time: selectedTime,
      date: formattedDate,
      type: role,
      price: Number(role === "Driver" ? price : maxPrice),
      pickUpLocation: isCustomPickUpLocation
        ? customPickUpDescription
        : pickUpLocation,
      stopByLocations,
      luggage: hasLuggage ? luggageDescription : null,
      seatsNeeded: role === "Passenger" ? Number(passengerFreeSeats) : null,
      seatsAvailable: role === "Driver" ? Number(freeSeats) : null,
      showPrice: role === "Driver" ? true : showPrice,
      phoneNumber: showPhoneNumber ? contactPhoneNumber : null,
    };
    try {
      const status = await createPost(postData);

      if (status === 200 || status === 201) {
        resetForm();
        Alert.alert(t("success"), t("postCreated"));
      } else {
        Alert.alert(t("error"), t("postCreationFailed"));
      }
    } catch (error) {
      Alert.alert(t("error"), t("somethingWentWrong"));
    }
  };

  const handleConfirmTime = (selectedTime: Date) => {
    setIsTimeSelectVisable(false);
    if (selectedTime) {
      setSelectedTimeDateFormat(selectedTime);
      setSelectedTime(
        selectedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        <LocationSelector
          startLocation={startLocation}
          endLocation={endLocation}
          setStartLocation={setStartLocation}
          setEndLocation={setEndLocation}
        />
        {role === "Driver" && (
          <TextInputField
            label={t("freeSeats") + "*"}
            value={freeSeats}
            onChangeText={setFreeSeats}
            placeholder={t("enterFreeSeats")}
            keyboardType="numeric"
            maxLength={2}
          />
        )}
        <View style={styles.datePickerContainer}>
          <Text style={[styles.createDateText, { fontWeight: "bold" }]}>
            {t("date")}*
          </Text>
          <View style={styles.input}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.enterDateText}>
                {date ? date.toLocaleDateString() : t("enterDate") + "*"}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker &&
            (Platform.OS === "ios" ? (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="fade"
              >
                <TouchableWithoutFeedback
                  onPress={() => setShowDatePicker(false)}
                >
                  <View style={styles.modalBackground}>
                    <View style={styles.pickerContainer}>
                      <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display="spinner"
                        textColor={!isThemeWhite ? "white" : "black"}
                        minimumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            setTempDate(selectedDate);
                          }
                        }}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          setDate(tempDate);
                          setShowDatePicker(false);
                        }}
                        style={styles.doneButton}
                      >
                        <Text style={{ color: "white" }}>{t("done")}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            ) : (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                minimumDate={new Date()}
                themeVariant={isThemeWhite ? "light" : "dark"}
                accentColor="#4797C8"
                display="default"
                textColor="black"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            ))}
        </View>
        <View>
          <SimpleInputFields
            label={t("latestArrivalTime") + "*"}
            value={selectedTime}
            placeholder={t("enterLatestArrivalTime")}
            onClick={() => {
              setIsTimeSelectVisable(true);
            }}
          />
          {Platform.OS === "android" && isTimeSelectVisable && (
            <DateTimePicker
              value={selectedTimeDateFormat}
              mode="time"
              is24Hour={true}
              display="default"
              textColor="black"
              themeVariant={isThemeWhite ? "light" : "dark"}
              accentColor="#4797C8"
              onChange={(event, selectedTime) => {
                setIsTimeSelectVisable(false);
                if (selectedTime) {
                  setSelectedTimeDateFormat(selectedTime);
                  setSelectedTime(
                    selectedTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  );
                }
              }}
            />
          )}
          {Platform.OS === "ios" && isTimeSelectVisable && (
            <Modal
              visible={isTimeSelectVisable}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsTimeSelectVisable(false)}
            >
              <TouchableWithoutFeedback
                onPress={() => setIsTimeSelectVisable(false)}
              >
                <View style={styles.modalContainer}>
                  <View
                    style={Platform.OS === "ios" && styles.pickerContainerTime}
                  >
                    <DateTimePicker
                      value={selectedTimeDateFormat}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      textColor={!isThemeWhite ? "white" : "black"}
                      onChange={(event, selectedTime) => {
                        if (selectedTime) {
                          const updatedDate = new Date(selectedTimeDateFormat);
                          updatedDate.setHours(selectedTime.getHours());
                          updatedDate.setMinutes(selectedTime.getMinutes());

                          setSelectedTimeDateFormat(updatedDate);
                          setSelectedTime(
                            updatedDate.toLocaleTimeString([], {
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
                        onPress={() =>
                          handleConfirmTime(selectedTimeDateFormat)
                        }
                      >
                        <Text style={styles.buttonText}>
                          {t("editPost.save")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </View>
        {role === "Driver" ? (
          <TextInputField
            label={t("price") + "*"}
            value={price}
            onChangeText={setPrice}
            placeholder={t("enterPrice")}
            keyboardType="numeric"
            maxLength={4}
          />
        ) : (
          <TextInputField
            label={t("price") + "*"}
            value={maxPrice}
            onChangeText={setMaxPrice}
            placeholder={t("enterMaxPrice")}
            keyboardType="numeric"
            maxLength={4}
          />
        )}
        <TextInputField
          label={t("phoneNumber") + "*"}
          value={String(contactPhoneNumber)}
          onChangeText={handlePhoneNumberChange}
          placeholder={t("contactNumberPlaceholder")}
          keyboardType="numeric"
        />
        {role === "Passenger" && (
          <TextInputField
            label={t("seatsNeeded") + "*"}
            value={passengerFreeSeats}
            onChangeText={setPassengerFreeSeats}
            placeholder={t("enterSeatsNeeded")}
            keyboardType="numeric"
            maxLength={2}
          />
        )}

        <RoleSelector role={role} setRole={setRole} />

        {role === "Passenger" && (
          <LuggageSection
            hasLuggage={hasLuggage}
            luggageDescription={luggageDescription}
            setHasLuggage={setHasLuggage}
            setLuggageDescription={setLuggageDescription}
          />
        )}
        {role === "Driver" && (
          <>
            <PickUpLocationSection
              pickUpLocation={pickUpLocation}
              customPickUpDescription={customPickUpDescription}
              setPickUpLocation={setPickUpLocation}
              setCustomPickUpDescription={setCustomPickUpDescription}
              isCustomPickUpLocation={isCustomPickUpLocation}
              setIsCustomPickUpLocation={setIsCustomPickUpLocation}
            />
            <CustomCheckbox
              text={t("canMakeAdditionalStops")}
              value={canStopBy}
              onValueChange={setCanStopBy}
            />
            {canStopBy && (
              <MultiLocationSelector
                stopByLocations={stopByLocations}
                setStopByLocations={setStopByLocations}
              />
            )}
          </>
        )}
        {role === "Passenger" && (
          <View style={styles.showPriceContainer}>
            <CustomCheckbox
              text={t("showPriceInPost")}
              value={showPrice}
              onValueChange={setShowPrice}
            />
          </View>
        )}
        <CustomCheckbox
          text={t("showPhoneNumber")}
          value={showPhoneNumber}
          onValueChange={setShowPhoneNumber}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{t("submit")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
