// import React from "react";
// import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
// import { useTranslation } from "react-i18next";

// interface ConfirmationModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
// }

// const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
//   visible,
//   onClose,
//   onConfirm,
// }) => {
//   const { t } = useTranslation();

//   const handlePrivacyPolicyPress = () => {
//     Linking.openURL("https://mojprevoz.com/privacy-policy/");
//   };

//   return (
//     <Modal
//       transparent={true}
//       animationType="fade"
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.title}>{t("confirmAction")}</Text>
//           <Text style={styles.policyText}>{t("policyDisclaimer")}</Text>
//           <TouchableOpacity onPress={handlePrivacyPolicyPress}>
//             <Text style={styles.linkText}>{t("privacyPolicyNotice")}</Text>
//           </TouchableOpacity>
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
//               <Text style={styles.buttonText}>{t("yes")}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
//               <Text style={styles.buttonText}>{t("no")}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContainer: {
//     width: "80%",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   message: {
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   policyText: {
//     fontSize: 12,
//     marginBottom: 10,
//     textAlign: "center",
//     color: "#888",
//   },
//   linkText: {
//     fontSize: 12,
//     color: "#4797C8", // Change to your desired link color
//     textDecorationLine: "underline", // Underline to indicate it's a link
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   confirmButton: {
//     backgroundColor: "#4CAF50",
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginRight: 5,
//     alignItems: "center",
//   },
//   cancelButton: {
//     backgroundColor: "#f44336",
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginLeft: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// export default ConfirmationModal;
