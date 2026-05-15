import React, { useState } from "react";
import { View, FlatList, RefreshControl, Text, TouchableOpacity } from "react-native";
import { getStyles } from "../../assets/styles/MyPostsStyles";
import PostItem from "@/components/PostItem";
import { Post } from "../../assets/types/types";
import { useAuth } from "../../hooks/AuthContext";
import { getAllSavedPostsForUser } from "@/components/callApi";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { useRouter,useFocusEffect } from "expo-router";

export default function savedPosts() {
  const { t } = useTranslation();
  const { userId ,isThemeWhite} = useAuth();
  const styles = getStyles(isThemeWhite ? 'light' : 'dark');
  const router = useRouter()

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchPosts = async () => {
    if (!userId) {
      setPosts([]);
      setIsLoading(false);
      return;
    }
    try {
      const fetchedPosts = await getAllSavedPostsForUser(Number.parseInt(userId));
      setPosts(fetchedPosts);
    } catch (error) {
      //@ts-ignore
      if (error?.response?.status === 404) {
        setPosts([])
      }
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts(); 
    }, [userId])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return <Loader isDarkTheme={!isThemeWhite} />;
  }

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>{t('noSavedPosts')}</Text>
          <Text style={styles.exploreText}>{t('exploreAndSavePosts')}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/AllPosts')} style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>{t('explorePosts')}</Text>
            </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostItem item={item} isEdit={false} refetchPost={async () => await fetchPosts()} />}
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
      )}
    </View>
  );
}
