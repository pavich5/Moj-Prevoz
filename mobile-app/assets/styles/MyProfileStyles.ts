import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
  },
  tabButton: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E2E2E',
  },
  activeTabText: {
    color: '#4797C8',
    fontWeight: 'bold',
  },
  scrollView: {
    paddingHorizontal: 20,
    marginTop: 15
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  joinedDate: {
    color: '#8E8E93',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderColor: '#D1D1D6',
    borderWidth: 1,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchButton: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#4797C8',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewText: {
    color: '#8E8E93',
  },
  deleteIcon: {
    position: "absolute",
    top: 3,
    right: 0
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    width: "45%",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#000",
  },
  confirmButton: {
    padding: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 5,
    width: "45%",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
  },
});