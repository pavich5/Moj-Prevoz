import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { styles } from "../assets/styles/UserDetailsStyles";


interface CreateReviewButtonProps {
  isDarkTheme: boolean;
  isButtonDisabled: boolean
  handleReviewSubmit: (reviewData: { reviewText: string; reviewStars: number }) => void;
}
const CreateReviewButton: React.FC<CreateReviewButtonProps> = ({
  isDarkTheme,
  handleReviewSubmit,
  isButtonDisabled
}) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: isDarkTheme ? "#333" : "#4797C8", marginTop: 20 },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {t("leaveReview")}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.reviewFormContainer,
              { backgroundColor: isDarkTheme ? "#1E1E1E" : "#FFF" },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButtonTopRight}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={isDarkTheme ? "#E0E0E0" : "#000"} />
            </TouchableOpacity>

            <Text
              style={[
                styles.reviewFormTitle,
                { color: isDarkTheme ? "#E0E0E0" : "#2B2D42" },
              ]}
            >
              {t("leaveReview")}
            </Text>
            <View style={styles.reviewStats}>
              <Text
                style={[
                  styles.reviewScore,
                  { color: isDarkTheme ? "#E0E0E0" : "#2B2D42" },
                ]}
              >
                {reviewRating}
              </Text>
              <View style={styles.starRatingContainer}>
                {[...Array(5)].map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setReviewRating(index + 1)}
                  >
                    <Ionicons
                      name={index < reviewRating ? "star" : "star-outline"}
                      size={32}
                      color={index < reviewRating ? "#4797C8" : "#2f2f2f"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TextInput
              style={[
                styles.reviewInput,
                {
                  backgroundColor: isDarkTheme ? "#2C2C2C" : "#FFF",
                  color: isDarkTheme ? "#E0E0E0" : "#000",
                  borderColor: isDarkTheme ? "#555" : "#ddd",
                  minWidth: "100%",
                },
              ]}
              placeholder={t("writeReviewPlaceholder")}
              placeholderTextColor={isDarkTheme ? "#777" : "#aaa"}
              value={reviewText}
              onChangeText={setReviewText}
            />
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: isButtonDisabled
                    ? "#aaa"
                    : "#4797C8",
                },
              ]}
              disabled={isButtonDisabled}
              onPress={()=> {
                handleReviewSubmit({
                  reviewStars: reviewRating,
                  reviewText: reviewText
                })
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                {t("submitReview")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateReviewButton;
