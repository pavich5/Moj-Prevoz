import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 10,
    marginBottom: 0,
  },
  logoText: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#4797C8',
    letterSpacing: 0, 
    display: 'flex',
    alignItems: 'center',
    marginLeft: 5,
    fontFamily: "Roboto"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 8,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    height: 50,
    borderRadius: 8,
    color: "#333",
  },
  forgotPassword: {
    color: "#007bff",
    marginBottom: 20,
    marginTop: 5,
    minWidth: 80,
    textAlign: "right"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  signInButton: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#000",
  },
  signUpButton: {
    backgroundColor: "#4797C8",
    padding: 15,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
  },
  nextButton: {
    backgroundColor: "#4797C8",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: "100%"
  },
  nextButtonText: {
    color: "#fff",
  },
  switchToLogin: {
    color: "#2F2F2F",
    marginTop: 20,
    marginBottom: 30
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    width: 50,
    textAlign: "center",
    fontSize: 24,
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 8,
    color: "#333",
    marginRight: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  passwordContainerLogin: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 0,
  },
  imagePickerContainer: {
    width: 100,
    height: 100,
    borderColor: '#ddd',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    objectFit: "contain"
  },
  profileImage: {
    borderRadius: 50,
    width: 100,
    height: 100,
    objectFit: "contain"

  },
  imagePickerText: {
    color: '#888',
  },
  segmentedControlContainer: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
    marginBottom: 10,
    width: "100%"
  },
  segmentedControl: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  segmentedControlActive: {
    backgroundColor: "#4797C8",
    borderColor: "#007BFF", 
    borderWidth: 1,
  },
  segmentedControlText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666666", 
  },
  segmentedControlTextActive: {
    color: "#FFFFFF", 
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  flagToggle: {
    marginRight: 15,
    marginLeft: "auto",
  },
  flagIcon: {
    width: 25,
    height: 25,
  },
  verificationCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  verificationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 44,
    height: 55,
    margin: 5,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8
  },
    passwordUpdateContainer: {
      padding: 30, 
      backgroundColor: "#fff",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 5,
      margin: 20, 
      width: 350,
      height: 330,
      marginTop: 50
    },
    passwordUpdateTitle: {
      fontSize: 22, 
      fontWeight: "bold",
      marginBottom: 25,
      color: "#333",
      textAlign: "center",
    },
    newPasswordInput: {
      width: "100%",
      padding: 15,
      borderWidth: 2, 
      borderColor: "#4CAF50", 
      borderRadius: 10,
      marginBottom: 20, 
      backgroundColor: "#f9f9f9",
      fontSize: 16,
      color: "#333",
      height: 53
    },
    passwordErrorText: {
      color: "red",
      marginBottom: 15,
      textAlign: "center",
      fontSize: 14,
    },
    passwordUpdateButton: {
      backgroundColor: "#4797C8",
      padding: 18,
      borderRadius: 10,
      alignItems: "center",
      display: 'flex',
      justifyContent: "center"
    },
    passwordUpdateButtonText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "500",
    },  
    logoImage: {
      width: 190,
      height: 190,
      objectFit: "contain"
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    pickerContainer: {
      width: "80%",
      backgroundColor: "#fff",
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
      color: "#333",
    },
    doneButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#4797C8",
      borderRadius: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 120
    },
    doneButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    logoWrapper: {
      position: 'relative',
    },
    hatImage: {
      position: 'absolute',
      top: 70,
      right: 10,
      width: 20,
      height: 20,
    },
    lottieAnimation: {
      width: 110,
      height: 110,
      marginLeft: 20
    },
});
