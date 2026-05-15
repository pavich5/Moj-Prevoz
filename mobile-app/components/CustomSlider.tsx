import { useAuth } from "@/hooks/AuthContext";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";

interface CustomSliderProps {
  value: string;
  onValueChange: (value: string) => void;
  onApply: (value: string) => void;
  onCancel: () => void;
  setIsEditing: (value: boolean) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  onValueChange,
  onApply,
  onCancel,
  setIsEditing,
}) => {
  const { isThemeWhite } = useAuth();
  const { t } = useTranslation();

  const [hour, setHour] = useState(value.split(":")[0]);
  const [minute, setMinute] = useState(value.split(":")[1]);

  const hourInputRef = useRef<TextInput>(null);
  const minuteInputRef = useRef<TextInput>(null);


  const formatValue = (hour: string, minute: string) => {
    const validHour = Math.min(Math.max(parseInt(hour) || 0, 0), 23)
      .toString()
      .padStart(2, "0");
    const validMinute = Math.min(Math.max(parseInt(minute) || 0, 0), 59)
      .toString()
      .padStart(2, "0");
    return { validHour, validMinute };
  };

  const handleBlur = () => {
    const { validHour, validMinute } = formatValue(hour, minute);
    setHour(validHour);
    setMinute(validMinute);
    onValueChange(`${validHour}:${validMinute}`);
    setIsEditing(false);
  };

  const handleHourChange = (text: string) => {
    if (/^\d{0,2}$/.test(text) && Number(text) < 24) {
      setHour(text);
      onValueChange(`${text}:${minute}`);
    }
  };

  const handleMinuteChange = (text: string) => {
    if (/^\d{0,2}$/.test(text) && Number(text) <= 59) {
      setMinute(text);
      onValueChange(`${hour}:${text}`);
    }
  };

  const handleIncrement = () => {
    const newMinute = (parseInt(minute, 10) + 15) % 60;
    const newHour =
      (parseInt(hour, 10) + Math.floor((parseInt(minute, 10) + 15) / 60)) % 24;
    const formattedValue = formatValue(
      newHour.toString(),
      newMinute.toString()
    );
    setHour(formattedValue.validHour);
    setMinute(formattedValue.validMinute);
    onValueChange(`${formattedValue.validHour}:${formattedValue.validMinute}`);
  };

  const handleDecrement = () => {
    let newMinute = parseInt(minute, 10) - 15;
    let newHour = parseInt(hour, 10);

    if (newMinute < 0) {
      newMinute += 60;
      newHour = (newHour - 1 + 24) % 24;
    }

    const formattedValue = formatValue(
      newHour.toString(),
      newMinute.toString()
    );
    setHour(formattedValue.validHour);
    setMinute(formattedValue.validMinute);
    setIsEditing(false);
    onValueChange(`${formattedValue.validHour}:${formattedValue.validMinute}`);
  };
  
  useEffect(() => {
    const [newHour, newMinute] = value.split(":");
    setHour(newHour);
    setMinute(newMinute);
  }, [value]);

  return (
    <View
      style={[styles.timeContainer, Platform.OS === "ios" && { height: 300 }]}
    >
      <TouchableOpacity onPress={handleIncrement}>
        <Text style={styles.arrowText}>▲</Text>
      </TouchableOpacity>
      <View style={styles.timeInputContainer}>
        <TextInput
          ref={hourInputRef}
          style={[
            styles.timeInput,
            { color: !isThemeWhite ? "white" : "black" },
          ]}
          value={hour}
          onChangeText={handleHourChange}
          onBlur={handleBlur}
          keyboardType="numeric"
          maxLength={2}
          onPress={() => {
            setIsEditing(true);
          }}
          onFocus={() => setIsEditing(true)}
        />
        <Text style={styles.colon}>:</Text>
        <TextInput
          ref={minuteInputRef}
          style={[
            styles.timeInput,
            { color: !isThemeWhite ? "white" : "black" },
          ]}
          value={minute}
          onChangeText={handleMinuteChange}
          onBlur={handleBlur}
          keyboardType="numeric"
          maxLength={2}
          onPress={() => {
            setIsEditing(true);
          }}
          onFocus={() => setIsEditing(true)}
        />
      </View>
      <TouchableOpacity onPress={handleDecrement}>
        <Text style={styles.arrowText}>▼</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelTimeFilter}
          onPress={() => {
            onCancel();
            setIsEditing(false);
          }}
        >
          <Text style={styles.cancelButtonText}>{t("editPost.cancel")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyTimeFilter}
          onPress={() => {
            onApply(`${hour}:${minute}`);
            setIsEditing(false);
          }}
        >
          <Text style={styles.applyButtonText}>{t("editPost.save")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
  },
  arrowText: {
    fontSize: 30,
    color: "#4797C8",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  timeInput: {
    fontSize: 35,
    textAlign: "center",
    width: 50,
  },
  colon: {
    fontSize: 35,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30
  },
  cancelTimeFilter: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "rgb(255 146 156)",
    alignItems: "center",
  },
  applyTimeFilter: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: "rgb(95 255 133)",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
  },
  applyButtonText: {
    color: "black",
  },
});

export default CustomSlider;
