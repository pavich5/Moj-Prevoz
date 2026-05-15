import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles as createStyles } from "../../assets/styles/HomeStyles";
import BottomDrawer from "@/components/DrawerFilters";
import FiltersAndSearch from "@/components/FiltersAndSearch";
import PostItem from "@/components/PostItem";
import { Post } from "../../assets/types/types";
import { getAllPosts } from "@/components/callApi";
import { useTranslation } from "react-i18next";
import api from "@/components/api";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";

export interface Option {
  label: string;
  value: string;
}
export const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export default function AllPostsScreen() {
  const { t } = useTranslation();
  const { userId,isThemeWhite } = useAuth();
  const router = useRouter();
  const styles = createStyles(!isThemeWhite);

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string | null>(null);
  const [selectedEndLocation, setSelectedEndLocation] = useState<string | null>(
    null
  );
  const [selectedStartLocation, setSelectedStartLocation] = useState<
    string | null
  >(null);
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "time" | "seats" | "startLocation" | "endLocation" | "need" | null
  >(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState<number>(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);


  const resetFilters = () => {
    if (
      selectedTime ||
      selectedSeats ||
      selectedEndLocation ||
      selectedStartLocation ||
      selectedNeed ||
      searchValue ||
      startDate ||
      endDate
    ) {
      setSelectedTime(null);
      setSelectedSeats(null);
      setSelectedEndLocation(null);
      setSelectedStartLocation(null);
      setSelectedNeed(null);
      setSearchValue("");
      fetchPosts(1, true);
      setPage(1);
      setEndDate(null);
      setStartDate(null);
      setIsFilterApplied(false);
    }
  };

  const fetchPosts = async (newPage: number = 1, refresh: boolean = false) => {
    try {
      setIsLoading(true);
      if (refresh) {
        setPosts([]);
      }
      if (newPage !== 1) {
        setLoadingMorePosts(true);
      }
      const postsData = await getAllPosts(
        (newPage - 1) * 10,
        10,
        Number.parseInt(userId ?? "")
      );
      if (postsData.length < 10) {
        setHasMorePosts(false);
      } else {
        setHasMorePosts(true);
      }
      setPosts((prevPosts) =>
        refresh ? postsData : [...prevPosts, ...postsData]
      );
    } catch (error) {
      //@ts-ignore
      if (error.status === 404) {
        setPosts((prevPosts) => prevPosts);
        setHasMorePosts(false);
      } else {
        setPosts([]);
      }
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setLoadingMorePosts(false);
      setRefreshing(false);
    }
  };

  const fetchFilteredPosts = async (timeSelected?: string | null) => {
    try {
      setIsFilterApplied(true);
      setIsLoading(true);
      setHasMorePosts(false);
      setPosts([]);
      const params = new URLSearchParams();
      if (timeSelected) params.append("time", timeSelected ?? "10:00");
      if (selectedSeats) params.append("seats", selectedSeats);
      if (selectedStartLocation)
        params.append("startingLocation", selectedStartLocation);
      if (selectedEndLocation)
        params.append("endLocation", selectedEndLocation);
      if (selectedNeed)
        params.append("type", selectedNeed === "ride" ? "2" : "1");
      if (startDate) params.append("startDate", formatDate(startDate));
      if (endDate) params.append("endDate", formatDate(endDate));

      const url = `/Posts/search?${params.toString()}&loggedUserId=${Number.parseInt(
        userId ?? ""
      )}`;
      const response = await api.get(url);
      const filteredPosts = response.data;
      setPosts(filteredPosts);
    } catch (error) {
      setPosts([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const loadMorePosts = () => {
    if (hasMorePosts) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
      setIsLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchPosts(1, true);
    resetFilters();
  };

  const openModal = (
    filterType: "time" | "seats" | "startLocation" | "need" | "endLocation"
  ) => {
    setSelectedFilter(filterType);
    setIsModalVisible(true);
  };

  const handleApplyTimeFilter = (value: string) => {
    setSelectedTime(value);
    closeModal();
    fetchFilteredPosts(value);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedFilter(null);
  };

  useEffect(() => {
    if (selectedNeed) {
      fetchFilteredPosts(selectedTime);
    }
  }, [selectedNeed]);
  useEffect(() => {
    if (startDate) {
      fetchFilteredPosts(selectedTime);
    }
  }, [startDate]);
  useEffect(() => {
    if (endDate) {
      fetchFilteredPosts(selectedTime);
    }
  }, [endDate]);

  useEffect(() => {
    if (selectedSeats) {
      fetchFilteredPosts(selectedTime);
    }
  }, [selectedSeats]);

  useEffect(() => {
    if (selectedEndLocation) {
      fetchFilteredPosts(selectedTime);
    }
  }, [selectedEndLocation]);

  useEffect(() => {
    if (selectedStartLocation) {
      fetchFilteredPosts(selectedTime);
    }
  }, [selectedStartLocation]);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <FiltersAndSearch
        openModal={openModal}
        selectedTime={selectedTime}
        selectedSeats={selectedSeats}
        selectedNeed={selectedNeed}
        startLocation={selectedStartLocation}
        endLocation={selectedEndLocation}
        resetFilters={resetFilters}
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
      {isLoading && !refreshing && (
        <ActivityIndicator size="large" color="#2E2E2E" />
      )}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostItem key={item.id} item={item} isEdit={false} />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={[
          styles.listContentContainer,
          posts.length === 0 && {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.noPostsContainer}>
              <Text style={styles.noPostsText}>{t("noPosts")}</Text>
              {!isFilterApplied ? (
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/createPost")}
                  style={styles.createPostButton}
                >
                  <Text style={styles.createPostButtonText}>
                    {t("createPost")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={resetFilters}
                  style={styles.resetButtonMain}
                >
                  <Text style={styles.resetButtonText}>
                    {t("ResetFilters")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          hasMorePosts ? (
            <TouchableOpacity
              onPress={loadMorePosts}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              }}
            >
              {loadingMorePosts ? (
                <ActivityIndicator color="#2E2E2E" />
              ) : !isLoading ? (
                <Text style={styles.loadMoreText}>{t("loadMore")}</Text>
              ) : null}
            </TouchableOpacity>
          ) : null
        }
      />
      <BottomDrawer
        isModalVisible={isModalVisible}
        selectedFilter={selectedFilter}
        selectedTime={selectedTime || "10:00"}
        handleTimeChange={(value) => setSelectedTime(value)}
        handleApplyTimeFilter={handleApplyTimeFilter}
        handleCancel={closeModal}
        setSelectedSeats={setSelectedSeats}
        setSelectedStartLocation={setSelectedStartLocation}
        setSelectedEndLocation={setSelectedEndLocation}
        setSelectedNeed={setSelectedNeed}
        closeModal={closeModal}
      />
    </View>
  );
}
