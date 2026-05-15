import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  userRole: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 0,
    marginBottom: 10
  },
  messageButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    marginTop: 10,
    marginBottom: 10
  },
  messageButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  reviewsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewContainer: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewTextContainer: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewDate: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  reviewFormContainer: {
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  reviewFormTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewScore: {
    fontSize: 36,
    fontWeight: "bold",
  },
  reviewInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    minWidth: "88%"
  },
  reviewSubmissionStatus: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  submitButton : {
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    backgroundColor: "rgba(0,123,85,1.00)",
    borderRadius: 8,
    textAlign: "center"
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  showMoreOptions: {
    position: 'absolute',
    top: '-22%',
    right: 20,
    zIndex: 100,
    borderRadius: 8,
  },
  editPopout: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    zIndex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    padding: 4,
    height: 200
  },
  editPopoutContainer: {
    alignItems: 'center',
  },

  backdrop: {
    position: 'absolute',
    top: '-30%',
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  showMoreOptionsContainer: {
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    position: 'relative',
    zIndex: 11,
    width: 190
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    width: 150,
  },
  optionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'rgba(0,123,85,1.00)', 
  },
  noReviewsContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  
  noReviewsText: {
    fontSize: 16,
    textAlign: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  editTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 10,
    width: "50%"
  },
  starRatingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  loadMoreText: {
    color: "rgba(0,123,85,1.00)",
    textAlign: "center",
    paddingVertical: 12,
    marginVertical: 16,
    fontSize: 16, 
    fontWeight: 'bold',
  },
  loadMoreButton: {
    flexDirection: 'row',       
    justifyContent: 'center',    
    alignItems: 'center',        
    padding: 10,         
    marginBottom: 50        
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButtonTopRight: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 10,
  },
  dotButton: {
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    right: 10,
    top: 15
  },
  backdropDot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  showMoreOptionsDot: {
    position: 'absolute',
    right: 45,
    top: 13,
    zIndex: 100,
    borderRadius: 8,
  },
  showMoreOptionsContainerDot: {
    padding: 8,
    borderRadius: 10,
    position: 'relative',
    zIndex: 11,
  },
  optionButtonDot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    width: "auto"
  },
  optionButtonTextDot: {
    marginLeft: 5,
    marginRight: 10,
    fontSize: 16,
    color: 'rgba(0,123,85,1.00)', 
  },
});
