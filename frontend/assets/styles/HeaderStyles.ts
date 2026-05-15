import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,123,85,0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    fontFamily: "RobotoBold",
    flex: 1,
  },
  flagToggle: {
    marginRight: 15,
    marginLeft: "auto",
  },
  flagIcon: {
    width: 25,
    height: 25,
  },
  themeToggle: {
    marginRight: 15,
  },
    modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  optionButtonText: {
    color: "white",
    fontSize: 16,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#4797C8",
    marginBottom: 10,
    borderRadius: 8,
    height: 53,
  },
  saveButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#4797C8",
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  iconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
  },
  countContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6, // For Android
    borderRadius: 50,
    marginLeft: 5
  },
  darkShadow: {
    shadowColor: "#E0E0E0",
    shadowOpacity: 0.1,
  },
  image: {
    borderRadius: 50,
  },
});
