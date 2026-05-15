import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  getUserDetails,
  submitReview,
  getReviewsForUser,
  deleteReview,
  updateReview,
} from "@/components/callApi";
import { UserDetails as UserDetailsType } from "../../components/callApi";
import { styles } from "../../assets/styles/UserDetailsStyles";
import { useAuth } from "../../hooks/AuthContext";
import RenderReview from "@/components/RenderReview";
import CreateReviewForm from "@/components/CreateReviewForm";
import { Review } from "../../assets/types/types";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { Filter } from "bad-words";
import Ionicons from "react-native-vector-icons/Ionicons";
import ReportModal from "@/components/ReportModal";
import BlockUserModal from "@/components/BlockUserModal";
import api from "@/components/api";
import { truncateName } from "@/hooks/helper";

const UserDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { userDetails: loggedInUser, isThemeWhite } = useAuth();
  const { t } = useTranslation();
  const isDarkTheme = !isThemeWhite;
  const filter = new Filter();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState<number | undefined>(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isDotButtonVisable, setIsDotButtonVisable] = useState(false);
  const [isReportUserModalVisible, setReportUserModalVisible] = useState(false);
  const [isBlockUserModalVisable, setIsBlockUserVisable] = useState(false);
  const hasSubmittedReview = reviews.some(
    (review) => review.senderId === loggedInUser?.id
  );

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const details = await getUserDetails(Number(id));
      setUserDetails(details);
      setReviews([]);
      await fetchReviews();
    } catch (error) {
      console.error(t("fetchUserDetailsError"), error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserDetails();
    }, [id])
  );
  const fetchReviews = async (skip = 0, take = 5) => {
    if (id === undefined) {
      return;
    }
    setReviewsLoading(true);
    if (skip === 0) {
      setReviews([]);
    }
    try {
      const fetchedReviews = await getReviewsForUser({
        userId: Number(id),
        skip: skip,
        take: take,
      });

      if (fetchedReviews.reviews.length < take) {
        setHasMorePosts(false);
      }

      setReviews((prevReviews) => [...prevReviews, ...fetchedReviews.reviews]);
      setUserRating(fetchedReviews.rating);
    } catch (error) {
      console.error(t("fetchReviewsError"), error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async ({
    reviewText,
    reviewStars,
  }: {
    reviewText: string;
    reviewStars: number;
  }) => {
    if (!loggedInUser || !id || !reviewText || !reviewStars) {
      return;
    }
    if (filter.isProfane(reviewText.trim().toLowerCase())) {
      Alert.alert(
        "Invalid Input",
        "Please avoid using inappropriate language."
      );
      return;
    }

    setIsButtonDisabled(true);
    await submitReview({
      senderId: loggedInUser.id,
      receiverId: Number(id),
      message: reviewText,
      stars: reviewStars,
    });
    await fetchReviews();
    setIsButtonDisabled(false);
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      await fetchReviews();
    } catch (error) {
      Alert.alert(t("error"), t("deleteReviewError"));
    }
  };

  const handleEditReview = async (reviewDetails: {
    id: number;
    updatedStars: number;
    updatedText: string;
  }) => {
    try {
      await updateReview({
        id: reviewDetails.id,
        stars: reviewDetails.updatedStars,
        text: reviewDetails.updatedText,
      });
      await fetchReviews();
    } catch (error) {
      Alert.alert(t("error"), t("updateReviewError"));
    }
  };

  const handleGetMoreReviews = async () => {
    if (hasMorePosts) {
      const nextPage = page + 1;
      setPage(nextPage);

      const skip = (nextPage - 1) * 5;
      await fetchReviews(skip, 5);
    }
  };

  const handleReportUser = async (reason: string) => {
    try {
      const payload = {
        reporterId: loggedInUser?.id,
        reportedUserId: userDetails?.id,
        reportReason: reason,
      };
      await api.post("/Users/report-user", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setReportUserModalVisible(false);
      Alert.alert(t("userReported"));
    } catch (error) {
      Alert.alert("Error reporting user, please try again later");
      console.error("Error reporting user", error);
      setReportUserModalVisible(false);
      throw error;
    }
  };
  const handleBlockUser = async () => {
    try {
      const payload = {
        BlockingUserId: loggedInUser?.id,
        BlockedUserId: userDetails?.id,
      };
      await api.post("/Users/block-user", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsBlockUserVisable(false);
      router.push("/(tabs)/AllPosts");
      Alert.alert(t("userBlocked"));
    } catch (error) {
      Alert.alert("Error blocking user, please try again later");
      console.error("Error blocking user", error);
      throw error;
    }
  };

  const handleSendMessage = () => {
    router.push({
      pathname: "/messages",
      params: {
        selectedUserId: userDetails?.id,
        selectedUserName: `${userDetails?.firstName} ${userDetails?.lastName}`,
      },
    });
  };

  if (loading) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: isDarkTheme ? "black" : "white" },
        ]}
      >
        <ActivityIndicator size="large" color="#2E2E2E" />
      </View>
    );
  }
  if (!userDetails) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkTheme ? "black" : "#E7ECF3",
          position: "relative",
        },
      ]}
    >
      {Number(id) !== loggedInUser?.id && (
        <TouchableOpacity
          onPress={() => {
            setIsDotButtonVisable((prev) => !prev);
          }}
          hitSlop={{ top: 60, bottom: 60, left: 60, right: 60 }}
          style={styles.dotButton}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={isDarkTheme ? "#ebebeb" : "#2f2f2f"}
          />
        </TouchableOpacity>
      )}
      <ReportModal
        visible={isReportUserModalVisible}
        onClose={() => setReportUserModalVisible(false)}
        onSubmit={(reason) => handleReportUser(reason)}
        title={t("reportUserTitle")}
        subtitle={t("reportUserSubtitle")}
        placeholderText={t("reportUserPlaceholder")}
      />
      <BlockUserModal
        isVisible={isBlockUserModalVisable}
        onClose={() => setIsBlockUserVisable(false)}
        onBlock={handleBlockUser}
      />
      {isDotButtonVisable && (
        <>
          <TouchableOpacity
            style={styles.backdropDot}
            activeOpacity={0.7}
            onPress={() => setIsDotButtonVisable(false)}
          />
          <View style={styles.showMoreOptionsDot}>
            <View
              style={[
                styles.showMoreOptionsContainerDot,
                { backgroundColor: isDarkTheme ? "#333" : "white" },
              ]}
            >
              <TouchableOpacity
                style={styles.optionButtonDot}
                onPress={() => {
                  setReportUserModalVisible(true);
                  setIsDotButtonVisable(false);
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#4797C8"
                />

                <Text
                  style={[
                    styles.optionButtonTextDot,
                    { color: isDarkTheme ? "white" : "#333" },
                  ]}
                >
                  {t("reportUser")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButtonDot, { marginTop: 15 }]}
                onPress={() => {
                  setIsBlockUserVisable(true);
                  setIsDotButtonVisable(false);
                }}
              >
                <Ionicons
                  name="ban-outline"
                  size={20}
                  color="rgba(255,0,0,1.00)"
                />

                <Text
                  style={[
                    styles.optionButtonTextDot,
                    { color: isDarkTheme ? "white" : "#333" },
                  ]}
                >
                  {t("blockUser.blockButton")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
      <View style={styles.profileContainer}>
        <Image
          source={
            userDetails.imageUri !== "noimage.jpg"
              ? { uri: userDetails.imageUri }
              : require("../../assets/images/user.jpg")
          }
          resizeMode="cover"
          style={styles.profileImage}
        />
        <Text
          style={[
            styles.userName,
            { color: isDarkTheme ? "#E0E0E0" : "#2B2D42" },
          ]}
        >
          {truncateName(`${userDetails.firstName} ${userDetails.lastName}`, 28)}
        </Text>
        <Text
          style={[
            styles.userRole,
            { color: isDarkTheme ? "#A9A9A9" : "#8C8C8C" },
          ]}
        >
          {t("Joined in")} {userDetails.joinedDate}
        </Text>
        {Number(id) !== loggedInUser?.id && (
          <TouchableOpacity
            style={[
              styles.messageButton,
              {
                backgroundColor: isThemeWhite ? "#4797C8" : "#333",
                padding: 9.5,
                borderRadius: 8,
                alignItems: "center",
              },
            ]}
            onPress={handleSendMessage}
          >
            <Text
              style={{
                color: isThemeWhite ? "#FFFFFF" : "#EFEFEF",
                fontWeight: "bold",
              }}
            >
              {t("send_message")}
            </Text>
          </TouchableOpacity>
        )}
        {userRating !== null && (
          <Text
            //@ts-ignore
            style={{
              color: isDarkTheme ? "#E0E0E0" : "#2B2D42",
              marginTop: "7px",
              fontWeight: "700",
            }}
          >
            {t("overallRating")}: {userRating?.toFixed(1)} ⭐
          </Text>
        )}
      </View>
      <View style={styles.reviewsContainer}>
        <Text
          style={[
            styles.reviewsTitle,
            { color: isDarkTheme ? "#E0E0E0" : "#2B2D42" },
          ]}
        >
          {t("reviews")}
        </Text>
        <RenderReview
          reviews={reviews}
          isDarkTheme={isDarkTheme}
          loggedInUserId={loggedInUser?.id}
          onDeleteReview={handleDeleteReview}
          onEditReview={handleEditReview}
          hasMoreReviews={hasMorePosts}
          onLoadMore={handleGetMoreReviews}
          reviewsLoading={reviewsLoading}
        />
      </View>
      {Number(id) !== loggedInUser?.id && !hasSubmittedReview && (
        <View style={{ marginTop: 20 }}>
          <CreateReviewForm
            isDarkTheme={isDarkTheme}
            handleReviewSubmit={handleReviewSubmit}
            isButtonDisabled={isButtonDisabled}
          />
        </View>
      )}

      {hasSubmittedReview && Number(id) !== loggedInUser?.id && (
        <Text style={{ color: "gray", textAlign: "center", marginTop: 20 }}>
          {t("youAlreadySubmittedAReview")}
        </Text>
      )}
    </View>
  );
};

export default UserDetails;
