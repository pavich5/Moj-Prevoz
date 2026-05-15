import React, { useState } from "react";
import { View, FlatList, Alert, RefreshControl, Text } from "react-native";
import PostItem from "@/components/PostItem";
import EditPostModal from "@/components/EditPostModal";
import {
  deleteOnePost,
  getAllPostsForUser,
  updateOnePost,
} from "@/components/callApi";
import Loader from "@/components/Loader";
import { Link, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { Post } from "@/assets/types/types";
import { getStyles } from "@/assets/styles/MyPostsStyles";
import { useAuth } from "@/hooks/AuthContext";
import { validateDate, validateTime } from "./createPost";
import { Filter } from "bad-words";

export default function MyPostsScreen() {
  const { t } = useTranslation();
  const { userDetails, isThemeWhite } = useAuth();

  const styles = getStyles(isThemeWhite ? "light" : "dark");
  const filter = new Filter();

  const [updatedPost, setUpdatedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchPosts = async () => {
    if (!userDetails?.id) {
      setPosts([]);
      setIsLoading(false);
      return;
    }
    try {
      const fetchedPosts = await getAllPostsForUser(userDetails.id);
      setPosts(fetchedPosts);
    } catch (error) {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const handleEditClick = (post: Post) => {
    setUpdatedPost({
      ...post,
      showPrice: post.showPrice ?? false,
    });
    setIsModalVisible(true);
  };

  const handleInputChange = (field: keyof Post, value: string) => {
    if (updatedPost) {
      setUpdatedPost({ ...updatedPost, [field]: value });
    }
  };

  const handleCheckboxChange = (value: boolean) => {
    if (updatedPost) {
      setUpdatedPost({ ...updatedPost, showPrice: value });
    }
  };

  const handleDateChange = (value: Date) => {
    if (updatedPost) {
      setUpdatedPost({ ...updatedPost, date: formatDate(value) });
    }
  };

  const handleSave = async () => {
    const showAlert = (title: string, message: string) =>
      Alert.alert(t(title), t(message));

    const isValidNumber = (value: any) => !isNaN(Number(value));

    if (!updatedPost?.startingLocation) {
      showAlert("missingFields", "pleaseFillAllRequiredFields");
      return;
    }

    if (!validateDate(updatedPost.date)) {
      showAlert("invalidDate", "pleaseEnterValidDate");
      return;
    }

    const isDriver = updatedPost.type === "driver";
    const isPassenger = updatedPost.type === "passenger";

    if (isDriver) {
      const { date, seatsAvailable, price, time, pickUpLocation, phoneNumber } =
        updatedPost;
      if (
        !date ||
        !seatsAvailable ||
        !price ||
        !validateTime(time) ||
        !pickUpLocation ||
        !phoneNumber
      ) {
        showAlert("missingOrInvalidFields", "ensureAllDriverFieldsFilled");
        return;
      }
      if (filter.isProfane(pickUpLocation.trim().toLowerCase())) {
        Alert.alert(
          "Invalid Input",
          "Please avoid using inappropriate language."
        );
        return;
      }
      if (!isValidNumber(price)) {
        showAlert("invalidPrice", "pleaseEnterValidPrice");
        return;
      }

      if (!isValidNumber(seatsAvailable) || Number(seatsAvailable) <= 0) {
        showAlert("invalidFreeSeats", "pleaseEnterValidFreeSeats");
        return;
      }
    }

    if (isPassenger) {
      const { time, price, phoneNumber, seatsNeeded, luggage } = updatedPost;

      if (!time || !price || !phoneNumber) {
        showAlert("missingOrInvalidFields", "ensureAllPassengerFieldsFilled");
        return;
      }
      if (luggage && filter.isProfane(luggage.trim().toLowerCase())) {
        Alert.alert(
          "Invalid Input",
          "Please avoid using inappropriate language."
        );
        return;
      }

      if (!isValidNumber(price)) {
        showAlert("invalidPrice", "pleaseEnterValidMaxPrice");
        return;
      }

      if (!isValidNumber(seatsNeeded) || Number(seatsNeeded) <= 0) {
        showAlert("invalidNeededSeats", "pleaseEnterValidNeededSeats");
        return;
      }
    }

    // Attempt to save the post
    if (updatedPost) {
      try {
        await updateOnePost(updatedPost);
        showAlert("success", "postUpdatedSuccessfully");

        if (userDetails?.id) {
          const fetchedPosts = await getAllPostsForUser(userDetails.id);
          setPosts(fetchedPosts);
        }
      } catch (error) {
        showAlert("error", "failedToUpdatePost");
      } finally {
        setIsModalVisible(false);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts();
    setIsRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [userDetails?.id])
  );

  if (isLoading) {
    return <Loader isDarkTheme={!isThemeWhite} />;
  }

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>{t("noPosts")}</Text>
          <Link href="/createPost" style={styles.createPostButton}>
            {t("createPost")}
          </Link>
        </View>
      ) : (
        <>
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <PostItem
                item={item}
                isEdit
                onEditClick={handleEditClick}
                onDeleteClick={async () => {
                  try {
                    await deleteOnePost(item.id);
                    await fetchPosts();
                    Alert.alert(t("saveSuccessTitle"), t("postDeletedMessage"));
                  } catch (error) {
                    setPosts([]);
                    Alert.alert(t("errorDeletingPostMessage"));
                  }
                }}
              />
            )}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={!isThemeWhite ? "#fff" : "#000"}
              />
            }
          />
          <EditPostModal
            handleCheckboxChange={handleCheckboxChange}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            updatedPost={updatedPost}
            handleDateChange={handleDateChange}
          />
        </>
      )}
    </View>
  );
}
