import { StyleSheet } from "react-native";

export const styles = (isDarkTheme: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: isDarkTheme ? "black" : "#F5F5F5", // Dark or light background
      padding: 16,
      paddingBottom: 0,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDarkTheme ? "#E0E0E0" : "#333333", // Light or dark text
    },
    input: {
      backgroundColor: isDarkTheme ? "#1F1F1F" : "#FFFFFF", // Dark or light input background
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      borderColor: isDarkTheme ? "#444" : "#E0E0E0", // Dark or light border
      borderWidth: 1,
      color: isDarkTheme ? "#E0E0E0" : "#333333", // Light or dark text
    },
    placeholder: {
      color: isDarkTheme ? "rgb(233 233 233)" : "#999999", // Dark or light placeholder text
    },
    segmentedControlContainer: {
      flexDirection: "row",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 24,
    },
    segmentedControl: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      backgroundColor: isDarkTheme ? "#1F1F1F" : "#FFFFFF", // Dark or light background
    },
    segmentedControlActive: {
      backgroundColor: isDarkTheme ? "#4797C8" : "#4797C8", // Same green for active state
    },
    segmentedControlText: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkTheme ? "#888" : "#666666", // Dark or light text
    },
    segmentedControlTextActive: {
      color: "#FFFFFF", // White text for active state
    },
    luggageContainer: {
      marginBottom: 16,
    },
    luggageToggle: {
      padding: 12,
      backgroundColor: isDarkTheme ? "#1F1F1F" : "#FFFFFF", // Dark or light background
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDarkTheme ? "#444" : "#E0E0E0", // Dark or light border
      marginBottom: 8,
      alignItems: "center",
    },
    luggageToggleActive: {
      backgroundColor: isDarkTheme ? "#333" : "#F5F5F5", // Dark or light background for active state
      borderColor: isDarkTheme ? "#222" : "#D0D0D0", // Dark or light border for active state
    },
    luggageText: {
      fontSize: 16,
      color: isDarkTheme ? "#888" : "#666666", // Dark or light text
    },
    luggageTextActive: {
      color: isDarkTheme ? "#E0E0E0" : "#333333", // Dark or light text for active state
    },
    pickUpLocationContainer: {
      marginBottom: 24,
    },
    pickUpOption: {
      padding: 12,
      backgroundColor: isDarkTheme ? "#1F1F1F" : "#FFFFFF", // Dark or light background
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkTheme ? "#444" : "#E0E0E0", // Dark or light border
      marginBottom: 8,
      alignItems: "center",
    },
    pickUpOptionActive: {
      backgroundColor: isDarkTheme ? "#4797C8" : "#4797C8", // Same green for active state
      borderColor: isDarkTheme ? "#222" : "#D0D0D0", // Dark or light border for active state
    },
    pickUpText: {
      fontSize: 16,
      color: isDarkTheme ? "#888" : "#666666", // Dark or light text
    },
    pickUpTextActive: {
      color: "#FFFFFF", // White text for active state
      fontWeight: "bold",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 40,
    },
    submitButton: {
      flex: 1,
      backgroundColor: "#4797C8", // Green
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginRight: 8,
      elevation: 2, // Android shadow
      shadowColor: "#000", // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginTop: 30
    },
    cancelButton: {
      flex: 1,
      backgroundColor: isDarkTheme ? "#333" : "#FFFFFF", // Dark or light background
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginLeft: 8,
      elevation: 2, // Android shadow
      shadowColor: "#000", // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF", // White
    },
    buttonTextCancel: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkTheme ? "#E0E0E0" : "#333333", // Dark or light text
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
    },
    checkbox: {
      width: 23,
      height: 23,
      borderWidth: 1.2,
      borderRadius: 4,
      borderColor: isDarkTheme ? "#444" : "#000",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    checkboxChecked: {
      backgroundColor: "white",
    },
    checkmark: {
      color: "#4797C8",
      fontSize: 13,
      position: "absolute",
    },
    checkboxLabel: {
      fontSize: 15,
      color: isDarkTheme ? "#E0E0E0" : "#333333",
    },
    stopByContainer: {
      marginVertical: 15,
    },
    showPriceContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 16,
    },
    showPriceLabel: {
      fontSize: 16,
      marginLeft: 8,
      color: isDarkTheme ? "#E0E0E0" : "#333333", // Dark or light text
    },
    priceInput: {
      height: 40,
      borderColor: isDarkTheme ? "#555" : "#ddd", // Dark or light border
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 8,
      backgroundColor: isDarkTheme ? "#333" : "#fff", // Dark or light background
      flex: 1,
      marginLeft: 8,
      color: isDarkTheme ? "#E0E0E0" : "#333", // Dark or light text
    },
    datePickerContainer: {
      position: "relative",
    },
    enterDateText: {
      color: isDarkTheme ? "rgb(233 233 233)" : "#999999", // Dark or light placeholder text
    },
    createDateText: {
      color: isDarkTheme ? "#E0E0E0" : "#333", // Dark or light text
      marginBottom: 5,
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    pickerContainer: {
      width: "91%",
      backgroundColor: isDarkTheme ? '#333' : "white",
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
    },
    closeButtonDate: {
      alignSelf: "flex-end",
      padding: 10,
    },
    closeButtonTextDate: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkTheme ? 'white' : 'black'
    },
    doneButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#4797C8",
      borderRadius: 5,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    doneButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    pickerContainerTime: {
      backgroundColor: isDarkTheme ? '#333' : 'white',
      marginHorizontal: 15,
      borderRadius: 10,
      padding: 15,
      overflow: "hidden",
      width: "92%"
    },
    buttonContainerTime: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    closeTimeModalButton: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 10,
      borderRadius: 20,
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    closeTimeModalButtonText: {
      fontSize: 18,
      color: isDarkTheme ? "white" : "black",
      fontWeight: "bold",
    },
    confirmButton: {
      flex: 1,
      padding: 10,
      alignItems: "center",
      backgroundColor: "#4797C8",
      borderRadius: 8,
      marginLeft: 5,
    },
    timeText: {
      marginTop: 20,
      fontSize: 18,
    },
  });
