import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const getStyles = (theme: string) =>  {
  const isDarkTheme = theme === "dark";
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: isDarkTheme ? 12: 16,
      backgroundColor: isDarkTheme ? 'black' : '#f9f9f9',
    },
    listContainer: {
      paddingBottom: 16,
    },
    postContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkTheme ? '#2c2c2e' : '#fff',
      padding: 16,
      borderRadius: 10,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkTheme ? '#E0E0E0' : '#333',
    },
    details: {
      fontSize: 14,
      color: isDarkTheme ? '#A9A9A9' : '#555',
      marginVertical: 4,
    },
    card: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      marginBottom: 16,
      backgroundColor: isDarkTheme ? "#2c2c2e" : "#FFF",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    title: {
      fontSize: 16,
      color: isDarkTheme ? "#A9A9A9" : "#555",
    },
    profilePicture: {
      width: 80,
      height: 100,
      borderRadius: 25,
    },
    button: {
      marginTop: 8,
      backgroundColor: "#4797C8",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      alignItems: "center",
      width: "50%",
    },
    buttonText: {
      color: "#FFF",
      fontSize: 14,
    },
    cancelButtonTextModal: {
      color: "black",
      fontSize: 14,
    },
    additionalStopsContainer: {
      marginTop: 10,
      paddingLeft: 15,
    },
    stopLocationText: {
      fontSize: 14,
      color: isDarkTheme ? "#A9A9A9" : "#555",
      marginBottom: 5,
    },
    readMoreButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    readMoreText: {
      fontSize: 14,
      color: "#4797C8",
      marginRight: 5,
    },
    priceText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#4797C8",
    },
    noPostsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    noPostsText: {
      fontSize: 18,
      color: isDarkTheme ? '#999' : '#ccc',
      marginBottom: 20,
    },
    createPostButton: {
      backgroundColor: "#4797C8",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 5,
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
      width: '95%',
      height: '80%', // Full height
      backgroundColor: isDarkTheme ? '#333' : '#FFFFFF',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    modalContent: {
      flexDirection: 'column',
      padding: 15,
      backgroundColor: isDarkTheme ? '#1c1c1e' : '#fff',
      borderRadius: 12,
      paddingTop: 25,
    },
    label: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkTheme ? '#E0E0E0' : '#333',
      marginBottom: 8,
    },
    input: {
      width: '100%',
      borderColor: isDarkTheme ? '#555' : '#ccc',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      backgroundColor: isDarkTheme ? "#1F1F1F" : "#FFFFFF", // Dark or light input background
      color: isDarkTheme ? '#E0E0E0' : '#333',
    },
    saveButton: {
      backgroundColor: isDarkTheme ? '#4797C8' : '#4797C8',
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      borderRadius: 10,
      marginTop: 12,
      display: "flex",
      justifyContent: 'center',
    },
    saveButtonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: '500',
    },
    cancelButton: {
      backgroundColor: 'transperent',
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      borderRadius: 10,
      marginTop: 8,
      display: "flex",
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: isDarkTheme ? "white" : "black"
    },
    cancelButtonText: {
      color: isDarkTheme ? "white" : "black",
      fontSize: 18,
      fontWeight: '500',
    },
    checkboxContainer: {
      marginVertical: 10,
    },
    exploreText: {
      fontSize: 14,
      color: theme ? "#A0A0A0" : "#666666",
      textAlign: "center",
      marginBottom: 20,
    },
    exploreButton: {
      backgroundColor: theme ? "#4797C8" : "#4797C8", 
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    exploreButtonText: {
      color: "#FFFFFF", 
      fontSize: 16,
      textAlign: "center",
    },
    datePickerContainer: {
      position: 'relative',
      marginBottom: 15, 
    },
    datePickerInput: {
      height: 45, 
      padding: 10,
      borderWidth: 1,
      borderColor: theme === "dark" ? '#555' : '#ddd', 
      borderRadius: 5,
      fontSize: 16, 
      backgroundColor: isDarkTheme ? "#1F1F1F" : "#FFFFFF", // Dark or light input background
    },
    datePickerText: {
      color: theme === "dark" ? '#E0E0E0' : '#333333',

    },
    createDateText: {
      color: theme === "dark" ? '#E0E0E0' : '#333333',
      marginBottom: 5,
      fontWeight: '700'
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    pickerContainer: {
      width: "90%",
      backgroundColor: isDarkTheme ? '#333' : 'white',
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
      color: isDarkTheme ? 'white' : 'black',
    },
    doneButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#4797C8",
      borderRadius: 5,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    doneButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalContainerTime: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    pickerContainerTime: {
      backgroundColor: isDarkTheme ? '#333' : 'white',
      marginHorizontal: 20,
      borderRadius: 10,
      padding: 15,
      overflow: "hidden",
    },
    buttonContainerTime: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    cancelButtonTime: {
      flex: 1,
      padding: 10,
      alignItems: "center",
      borderRadius: 8,
      borderWidth: 1,
      color: "black",
      marginRight: 5,
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
  
}