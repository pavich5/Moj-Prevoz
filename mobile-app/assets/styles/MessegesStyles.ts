import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "RobotoBold",
  },
  backButton: {
    padding: 8,
    position: "absolute",
    left: 0,
  },
  messagesList: {
    padding: 7,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: "row",
  },
  messageSender: {
    fontSize: 14,
    fontWeight: "bold",
  },
  messageContent: {
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  sendButton: {
    backgroundColor: "#4797C8", // Jakarta green color
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  searchInputContainer: {
    backgroundColor: "rgb(255, 255, 255)",
    flexDirection: "row",
    maxHeight: 40,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "93%",
    marginBottom: 15,
  },
  searchInputWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  senderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeToggle: {
    marginLeft: "auto", 
    marginRight: 15,
  },
  flagToggle: {
    marginRight: 15,
    marginLeft: "auto",
  },
  flagIcon: {
    width: 24,
    height: 24,
  },
  messageItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 20,
    maxWidth: "75%",
  },
  nameAndBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#4797C8",
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 18,
    width: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalMenu: {
    backgroundColor: "#FFFFFF",
    width: 200,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalText: {
    fontSize: 16,
    color: "#1C1C1E",
    textAlign: "center",
  },

  modalImageContainer: {
    width: "90%",
    height: "90%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 5,
    marginBottom: Platform.OS === "android" ? 30 : 0,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  plusButton: {
    marginRight: 10,
    backgroundColor: "#007BFF",
    padding: 5,
    borderRadius: 30,
  },
  optionsContainer: {
    position: "absolute",
    top: -100,
    left: 50,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    zIndex: 1,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#555",
    borderRadius: 5,
    marginBottom: 5,
  },
  optionText: {
    color: "#FFFFFF",
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  senderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 20,
  },
  senderProfile: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  senderListImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  senderDetails: {
    marginLeft: 15,
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessagePreview: {
    fontSize: 14,
    fontWeight: "normal",
    marginTop: 4,
  },
  newMessageBadge: {
    backgroundColor: "#4797C8",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    height: 8,
    width: 8,
    marginRight: 13
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  lastMessageTime: {
    fontSize: 12,
    fontWeight: "normal",
    marginLeft: 10,
    textAlign: "right",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyAnimation: {
    width: 200,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  sendersList: {
    flexGrow: 1,
    padding: 0,
    marginTop: 5
  },
  circleRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  circleWrapper: {
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  circleImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 5,
  },
  circleText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20
  },
  
});
