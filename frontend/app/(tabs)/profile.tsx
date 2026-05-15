import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { styles } from "../../assets/styles/MyProfileStyles";
import {
  updateUserDetails,
  getReviewsForUser,
  deleteUser,
  logoutUser,
} from "@/components/callApi";
import * as ImagePicker from "expo-image-picker";
import Loader from "@/components/Loader";
import RenderReview from "@/components/RenderReview";
import PersonalDetailsTab from "@/components/PersonalDetailsTab";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getImgbbUploadUrl } from "@/constants/config";
import { useAuth } from "@/hooks/AuthContext";
import { Review, UserDetails } from "@/assets/types/types";
import { useRouter } from "expo-router";
import * as ImageManipulator from "expo-image-manipulator";
import { Filter } from "bad-words";

const Profile = () => {
  const { userDetails, setUserDetails, jwtToken, isThemeWhite } = useAuth();
  const { t } = useTranslation();
  const isDarkTheme = !isThemeWhite;
  const filter = new Filter();

  const [selectedTab, setSelectedTab] = useState("PersonalDetails");
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editableFields, setEditableFields] = useState({
    firstName: "",
    lastName: "",
  });
  const [profileImage, setProfileImage] = useState(userDetails?.imageUri);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [isProfilePictureLoading, setIsProfilePictureLoading] = useState(false);
  const router = useRouter();

  const uploadImage = async (uri: string) => {
    setIsProfilePictureLoading(true);
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 700, height: 700 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    const formData = new FormData();
    //@ts-ignore
    formData.append("image", {
      uri: manipulatedImage.uri,
      name: "image.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(getImgbbUploadUrl(), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsProfilePictureLoading(false);
      return response.data.data.url;
    } catch (error) {
      return null;
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1], // Force 1:1 aspect ratio
      allowsMultipleSelection: false // Only allow single image selection
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const uploadedUrl = await uploadImage(fileUri);
      if (uploadedUrl) {
        setProfileImage(uploadedUrl);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (userDetails?.id === undefined) {
        throw new Error("User ID is not defined");
      }
      if (!editableFields.firstName || !editableFields.lastName) return;
      if (
        filter.isProfane(editableFields.firstName.trim().toLowerCase()) ||
        filter.isProfane(editableFields.lastName.trim().toLowerCase())
      ) {
        Alert.alert(
          "Invalid Input",
          "Please avoid using inappropriate language."
        );
        return;
      }
      if (
        editableFields.firstName.length > 40 ||
        editableFields.lastName.length > 40
      ) {
        Alert.alert(
          "Error",
          "First name or last name is too long. Please ensure both names are less than 40 characters."
        );
        return;
      }
      const updatedUserDetails = {
        id: userDetails.id,
        firstName: editableFields.firstName,
        lastName: editableFields.lastName,
        phoneNumber: userDetails.phoneNumber,
        email: userDetails.email,
        imageUri: profileImage || userDetails.imageUri,
        joinedDate: userDetails.joinedDate,
        isThemeWhite: userDetails.isThemeWhite,
      };

      await updateUserDetails(updatedUserDetails);
      setUserDetails(updatedUserDetails as UserDetails);

      Alert.alert(t("saveSuccessTitle"), t("saveSuccessMessage"));
    } catch (error) {
      console.error("Error saving user details:", error);
      Alert.alert(t("saveErrorMessage"));
    }
  };

  const fetchReviews = async (skip = 0, take = 5) => {
    if (userDetails?.id === undefined) {
      return;
    }
    setReviewsLoading(true);
    if (skip === 0) {
      setReviews([]);
    }

    try {
      const fetchedReviews = await getReviewsForUser({
        userId: userDetails.id,
        skip: skip,
        take: take,
      });

      if (fetchedReviews.reviews.length < take) {
        setHasMorePosts(false);
      }

      setReviews((prevReviews) => [...prevReviews, ...fetchedReviews.reviews]);
    } finally {
      setReviewsLoading(false);
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

  const handleDeleteUser = () => {
    void deleteUser(userDetails?.id as number);
    Alert.alert("Profile successfully deleted");
    logoutUser(jwtToken as string);
    router.push("/login");
  };

  useEffect(() => {
    if (userDetails) {
      setEditableFields({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      });
      setProfileImage(userDetails.imageUri);
      setLoading(false);
    }
  }, [userDetails]);

  useEffect(() => {
    if(selectedTab === 'Reviews'){
      fetchReviews();
    }
  }, [selectedTab]);

  if (loading) {
    return <Loader isDarkTheme={isDarkTheme} />;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "black" : "#F5F7FA" },
      ]}
    >
      <View
        style={[
          styles.tabContainer,
          { backgroundColor: isDarkTheme ? "rgb(20, 20, 20)" : "#F5F7FA" },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "PersonalDetails" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("PersonalDetails")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "PersonalDetails" && styles.activeTabText,
              { color: isDarkTheme ? "#FFF" : "#2E2E2E" },
            ]}
          >
            {t("PersonalDetails")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Reviews" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Reviews")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Reviews" && styles.activeTabText,
              { color: isDarkTheme ? "#E0E0E0" : "#2E2E2E" },
            ]}
          >
            {t("Reviews")}
          </Text>
        </TouchableOpacity>
      </View>
      {selectedTab === "PersonalDetails" && (
        <PersonalDetailsTab
          profileImage={profileImage}
          editableFields={editableFields}
          joinedDate={userDetails?.joinedDate ?? ""}
          isDarkTheme={isDarkTheme}
          handleSave={handleSave}
          handleImagePick={handleImagePick}
          //@ts-ignore
          setEditableFields={setEditableFields}
          email={userDetails?.email ?? ""}
          phoneNumber={userDetails?.phoneNumber ?? ""}
          isProfilePictureLoading={isProfilePictureLoading}
          handleDeleteUser={handleDeleteUser}
        />
      )}

      {selectedTab === "Reviews" && (
        <View style={styles.scrollView}>
          <RenderReview
            isDarkTheme={isDarkTheme}
            reviews={reviews}
            isFromMyProfile
            onLoadMore={handleGetMoreReviews}
            hasMoreReviews={hasMorePosts}
            reviewsLoading={reviewsLoading}
          />
        </View>
      )}
    </View>
  );
};

export default Profile;
