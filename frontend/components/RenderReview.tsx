import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "../assets/styles/UserDetailsStyles";
import { Review } from "@/assets/types/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button";
import { Filter } from "bad-words";
import { truncateName } from "@/hooks/helper";

interface RenderReviewProps {
  reviews: Review[];
  isDarkTheme: boolean;
  loggedInUserId?: number;
  onEditReview?: (value: {
    id: number;
    updatedStars: number;
    updatedText: string;
  }) => void;
  onDeleteReview?: (reviewId: number) => void;
  onLoadMore?: () => void;
  hasMoreReviews?: boolean;
  isFromMyProfile?: boolean;
  reviewsLoading?: boolean;
}

const RenderReview: React.FC<RenderReviewProps> = ({
  reviews,
  isDarkTheme,
  loggedInUserId,
  onEditReview,
  onDeleteReview,
  onLoadMore,
  hasMoreReviews = true,
  isFromMyProfile = false,
  reviewsLoading = false,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const filter = new Filter();

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editText, setEditText] = useState<string>("");
  const [editStars, setEditStars] = useState<number>(0);

  const handleOpenModal = (review: Review) => {
    setSelectedReview(review);
    setEditStars(review.stars);
    setEditText(review.text);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReview(null);
  };

  const handleSubmitEdit = () => {
    if (selectedReview) {
      if (filter.isProfane(editText.trim().toLowerCase())) {
        Alert.alert(
          "Invalid Input",
          "Please avoid using inappropriate language."
        );
        return;
      }
      onEditReview?.({
        id: selectedReview.id,
        updatedStars: editStars,
        updatedText: editText,
      });
      handleCloseModal();
      setEditVisible(false);
    }
  };

  const handleDelete = () => {
    if (selectedReview) {
      onDeleteReview?.(selectedReview.id);
      handleCloseModal();
    }
  };

  const renderReview: ListRenderItem<Review> = ({ item, index }) => (
    <View
      style={[
        styles.reviewContainer,
        { backgroundColor: isDarkTheme ? "#1E1E1E" : "#FFF" },
      ]}
      key={item.id + index}
    >
      <TouchableOpacity
        onPress={() => router.push(`/userdetails/${item.senderId}`)}
      >
        <Image
          source={
            item.imageUri !== "noimage.jpg"
              ? { uri: item.imageUri }
              : require("../assets/images/user.jpg")
          }
          style={styles.reviewImage}
        />
      </TouchableOpacity>
      <View style={styles.reviewTextContainer}>
        <View style={styles.reviewHeader}>
          <Text
            style={[
              styles.reviewerName,
              { color: isDarkTheme ? "#E0E0E0" : "#2B2D42" },
            ]}
          >
            {truncateName(item.senderName, 20)}
          </Text>
          <Text
            style={[
              styles.reviewDate,
              { color: isDarkTheme ? "#A9A9A9" : "#4f5e7b" },
            ]}
          >
            {item.date}
          </Text>
          {loggedInUserId === item.senderId && (
            <TouchableOpacity onPress={() => handleOpenModal(item)}>
              <Ionicons name="ellipsis-vertical" size={24} color={isDarkTheme ? "#ebebeb" : "#2f2f2f"} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(item.stars)].map((_, index) => (
            <Ionicons key={index} name="star" size={16} color="#4797C8" />
          ))}
        </View>
        <Text
          style={[
            styles.reviewText,
            { color: isDarkTheme ? "#E0E0E0" : "#4f5e7b" },
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <View style={{ maxHeight: isFromMyProfile ? 1000 : 300 }}>
        {reviews.length === 0 ? (
          <Text
            style={[
              styles.noReviewsText,
              {
                color: isDarkTheme ? "#E0E0E0" : "#4f5e7b",
                textAlign: "center",
                marginTop: 20,
              },
            ]}
          >
            {t("No reviews yet. Be the first to leave a review!")}
          </Text>
        ) : (
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={(item, index) => `${String(item.id)}-${index}`}
            ListFooterComponent={
              hasMoreReviews ? (
                <TouchableOpacity
                  //@ts-ignore
                  className={reviewsLoading && styles.loadingReviews}
                  onPress={onLoadMore}
                  style={styles.loadMoreButton}
                >
                  <Text style={styles.loadMoreText}>
                    {reviewsLoading ? (
                      <ActivityIndicator size="large" color="#2E2E2E" />
                    ) : (
                      t("loadMore")
                    )}
                  </Text>
                </TouchableOpacity>
              ) : null
            }
          />
        )}
      </View>

      {selectedReview && modalVisible && (
        <>
          <TouchableOpacity
            style={styles.backdrop}
            onPress={handleCloseModal}
          />
          <View style={styles.showMoreOptions}>
            <View
              style={[
                styles.showMoreOptionsContainer,
                { backgroundColor: isDarkTheme ? "#333" : "#f5f6fa" },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    marginBottom: 15,
                    marginTop: 5,
                  },
                ]}
                onPress={() => {
                  setEditVisible(true);
                  setModalVisible(false);
                }}
              >
                <Ionicons
                  name="pencil"
                  size={20}
                  color={isDarkTheme ? "green" : "#4797C8"}
                />
                <Text
                  style={[
                    styles.optionButtonText,
                    { color: isDarkTheme ? "white" : "black" },
                  ]}
                >
                  {t("Edit")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    marginBottom: 8,
                  },
                ]}
                onPress={handleDelete}
              >
                <Ionicons name="trash" size={20} color="red" />
                <Text
                  style={[
                    styles.optionButtonText,
                    { color: isDarkTheme ? "white" : "black" },
                  ]}
                >
                  {t("Delete")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      <Modal
        visible={editVisible}
        animationType="fade"
        onRequestClose={() => {
          setEditVisible(false);
        }}
        transparent
      >
        <TouchableOpacity style={styles.backdrop} onPress={handleCloseModal} />
        <View style={styles.editPopout}>
          <View style={styles.editPopoutContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setEditVisible(false);
              }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.editTextInput}
              placeholder={t("Edit review text")}
              value={editText}
              onChangeText={setEditText}
            />
            <View style={styles.starRatingContainer}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setEditStars(index + 1)}
                >
                  <Ionicons
                    name={index < editStars ? "star" : "star-outline"}
                    size={32}
                    color={index < editStars ? "#4797C8" : "#2f2f2f"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Button
              style={{ backgroundColor: "#4797C8" }}
              title={t("Save")}
              onPress={handleSubmitEdit}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default RenderReview;
