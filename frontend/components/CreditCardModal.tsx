// import React, { useState } from "react";
// import {
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { useTranslation } from "react-i18next";

// const CreditCardScreen: React.FC<{
//   onSubmit: (cardDetails: {
//     cardNumber: string;
//     expiryDate: string;
//     cvv: string;
//   }) => void;
//   onSkip: () => void;
// }> = ({ onSubmit, onSkip }) => {
//   const { t } = useTranslation();
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [cvv, setCvv] = useState("");

//   const handleSubmit = () => {
//     if (cardNumber && expiryDate && cvv) {
//       onSubmit({ cardNumber, expiryDate, cvv });
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>{t("enterCreditCardDetails")}</Text>
//       <TextInput
//         placeholder={t("cardNumber")}
//         style={styles.input}
//         value={cardNumber}
//         onChangeText={setCardNumber}
//       />
//       <TextInput
//         placeholder={t("expiryDate")}
//         style={styles.input}
//         value={expiryDate}
//         onChangeText={setExpiryDate}
//       />
//       <TextInput
//         placeholder={t("cvv")}
//         style={styles.input}
//         value={cvv}
//         onChangeText={setCvv}
//         secureTextEntry={true}
//       />
//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>{t("submit")}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
//         <Text style={styles.buttonText}>{t("skip")}</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     padding: 20,
//     minWidth: 400
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     marginBottom: 15,
//     padding: 10,
//     borderRadius: 5,
//     width: "100%",
//   },
//   submitButton: {
//     backgroundColor: "#4797C8",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     width: "100%",
//   },
//   skipButton: {
//     marginTop: 10,
//     alignItems: "center",
//     backgroundColor: "#4797C8",
//     padding: 10,
//     borderRadius: 5,
//     width: "100%",
//   },
//   buttonText: {
//     color: "#fff",
//   },
// });

// export default CreditCardScreen;
