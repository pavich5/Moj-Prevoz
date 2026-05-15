import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Linking,
  Modal,
  Alert,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { styles as createStyles } from "@/assets/styles/HomeStyles";
import { useRouter } from "expo-router";
import { Post } from "@/assets/types/types";
import { useTranslation } from "react-i18next";
import { TabBarIcon } from "./navigation/TabBarIcon";
import { useAuth } from "@/hooks/AuthContext";
import api from "./api";
import ReportModal from "./ReportModal";
import { truncateName } from "@/hooks/helper";

interface PostItemProps {
  item: Post;
  isEdit: boolean;
  onEditClick?: (post: Post) => void;
  onDeleteClick?: (postId: number) => void;
  refetchPost?: () => void;
}

const PostItem: React.FC<PostItemProps> = ({
  item,
  isEdit,
  onEditClick,
  onDeleteClick,
  refetchPost,
}) => {
  const { isThemeWhite } = useAuth();
  const { t } = useTranslation();
  const { userId } = useAuth();

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(
    item.savedByUserIds?.includes(Number(userId)) ?? false
  );
  const [isDotMenuVisable, setIsDotMenuVisable] = useState(false);
  const [isReportModalVisable, setIsReportModalVisable] = useState(false);
  const router = useRouter();
  const styles = createStyles(!isThemeWhite);
  const isDriver = item.type === "driver";
  const isPassenger = item.type === "passenger";
  const pickupLocation = item.pickUpLocation;
  const isCoordinates = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(
    pickupLocation ?? ""
  );
  const isExpanded = expandedPostId === String(item.id);

  const stopByLocations = item.stopByLocations
    ? item.stopByLocations.split(", ")
    : [];

  const pickupMessage = isCoordinates
    ? t("pickupMessages.coordinates")
    : pickupLocation === "Home"
    ? `${t("pickupMessages.fromHome")} ${t("pickupMessages.orArrange")},${t(
        "pickupMessages.startTimeIs"
      )}`
    : `${t("pickupMessages.fromLocation")} ${pickupLocation}`;

  const toggleExpand = () => {
    setExpandedPostId(isExpanded ? null : String(item.id));
  };

  const handleMapOpen = (coordinates: string) => {
    const url = `https://www.google.com/maps?q=${coordinates}`;
    Linking.openURL(url);
  };
  const handleDelete = () => {
    if (onDeleteClick && item.id) {
      Alert.alert(
        t("Delete"),
        t("areYouSureDelete"),
        [
          { text: t("editPost.cancel"), style: "cancel" },
          {
            text: t("Delete"),
            style: "destructive",
            onPress: () => onDeleteClick(item.id),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleSavePost = async () => {
    const url = isSaved ? "Posts/remove-post" : "Posts/save-post";

    const body = {
      postId: item.id,
      userId,
    };

    try {
      const response = await api.post(url, body);
      if (response.status === 200) {
        setIsSaved((prev) => !prev);
        refetchPost?.();
      } else {
        console.error("Failed to save/unsave post");
      }
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const handleSubmitReportPost = async (reason: string) => {
    try {
      const payload = {
        userId: Number.parseInt(userId ?? ""),
        postId: item.id,
        reportReason: reason,
      };
      await api.post("/Posts/report-post", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      Alert.alert(t("postReportedSuccessfully"));
      setIsReportModalVisable(false);
    } catch (error) {
      Alert.alert("Error reporting post, please try again later");
      console.error("Error reporting post", error);
      setIsReportModalVisable(false);
      throw error;
    }
  };
  const sendUserMessage = (item: Post) => {
    router.push({
      pathname: "/messages",
      params: {
        selectedUserId: item.userId,
        selectedUserName: `${item.firstName} ${item.lastName}`,
      },
    });
  };

  return !isEdit ? (
    <View style={styles.card} key={item.id}>
      <View style={styles.textContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.userInfoContainer}
            onPress={() => {
              router.push(`/userdetails/${item.userId}`);
            }}
          >
            <Image
              source={
                item.imageUri !== "noimage.jpg"
                  ? { uri: item.imageUri }
                  : require("../assets/images/user.jpg")
              }
              style={styles.profileImage}
            />
            <Text style={styles.userName}>
              {truncateName(`${item.firstName} ${item.lastName}`, 25)}
            </Text>
          </TouchableOpacity>
          <View style={styles.savePostButton}>
            <TabBarIcon
              name={isSaved ? "bookmark" : "bookmark-outline"}
              color={
                isSaved && isThemeWhite
                  ? "#2E2E2E"
                  : isSaved && !isThemeWhite
                  ? "#f5f5f5"
                  : "gray"
              }
              size={24}
              onPress={handleSavePost}
            />
            <TouchableOpacity
              onPress={() => setIsDotMenuVisable((prev) => !prev)}
              style={styles.dotButton}
            >
              <View style={styles.dot}></View>
              <View style={styles.dot}></View>
              <View style={styles.dot}></View>
            </TouchableOpacity>
            <ReportModal
              visible={isReportModalVisable}
              onClose={() => setIsReportModalVisable(false)}
              onSubmit={(reason) => void handleSubmitReportPost(reason)}
              title={t("reportPost")}
              subtitle={t("reportPostSubtitle")}
              placeholderText={t("reportPostPlaceholder")}
            />
            {isDotMenuVisable && (
              <>
                <TouchableOpacity
                  style={styles.backdrop}
                  onPress={() => setIsDotMenuVisable(false)}
                />
                <View style={styles.showMoreOptions}>
                  <View style={styles.showMoreOptionsContainer}>
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        setIsDotMenuVisable(false);
                        setIsReportModalVisable(true);
                      }}
                    >
                      <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color={isThemeWhite ? "#2F2F2F" : "#e0e0e0"}
                      />

                      <Text style={styles.optionButtonText}>
                        {t("reportPost")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
        <Text
          style={styles.title}
          onPress={() => {
            if (isCoordinates && pickupLocation) {
              handleMapOpen(pickupLocation);
            }
          }}
        >
          {isDriver && item.seatsAvailable !== undefined ? (
            <>
              {`${t("cardTexts.lHave")} ${item.seatsAvailable} ${
                //@ts-ignore
                item.seatsAvailable > 1
                  ? t("cardTexts.freeSeats")
                  : t("cardTexts.freeSeat")
              } ${t("cardTexts.from")} `}
              <Text style={{ fontWeight: "600" }}>{item.startingLocation}</Text>
              {` ${t("cardTexts.to")} `}
              <Text style={{ fontWeight: "600" }}>{item.endLocation}</Text>
              {` ${t("onDate")} ${item.date}. ${pickupMessage} ${t(
                "cardTexts.at"
              )} ${item.time}.`}
            </>
          ) : isPassenger && item.seatsNeeded !== undefined ? (
            <>
              {`${t("cardTexts.iNeed")} ${item.seatsNeeded} ${
                //@ts-ignore
                item.seatsNeeded > 1
                  ? t("cardTexts.seats2")
                  : t("cardTexts.seats")
              } ${t("cardTexts.from")} `}
              <Text style={{ fontWeight: "600" }}>{item.startingLocation}</Text>
              {` ${t("cardTexts.to")} `}
              <Text style={{ fontWeight: "600" }}>{item.endLocation}</Text>
              {` ${t("onDate")} ${item.date} ${t(
                "cardTexts.withLatestArrivalTime"
              )} ${item.time}.`}
            </>
          ) : (
            ""
          )}
        </Text>
        <TouchableOpacity
          style={[styles.readMoreButton, { justifyContent: "space-between" }]}
          onPress={toggleExpand}
        >
          <View style={styles.readMore}>
            <Text style={styles.readMoreText}>{t("readMore")}</Text>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={isThemeWhite ? "black" : "white"}
            />
          </View>
          <Text style={styles.createdDate}>{formatDate(item.createdDate)}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.additionalStopsContainer}>
            {item.price && (
              <Text style={styles.priceText}>
                {item.type === "driver"
                  ? `${t("price")}: ${item.price}мкд`
                  : item.showPrice
                  ? `${t("Paying")}: ${item.price}мкд`
                  : `${t("Paying")}: ${t("passengerPriceText")}`}
              </Text>
            )}
            <TouchableOpacity
              onPress={() =>
                item.phoneNumber
                  ? Linking.openURL(`tel:${item.phoneNumber}`)
                  : sendUserMessage(item)
              }
            >
              <Text style={styles.priceText}>
                {item.phoneNumber ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}
                  >
                    <Text style={styles.priceText}>
                      {`${t("phoneNumber")}: ${item.phoneNumber}`}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  t("noPhoneNumberMessage")
                )}
              </Text>
            </TouchableOpacity>

            {item.type === "passenger" && (
              <TouchableOpacity>
                <Text style={styles.priceText}>
                  {t("cardTexts.luggage")}:{" "}
                  {item.luggage || t("cardTexts.none")}
                </Text>
              </TouchableOpacity>
            )}
            {item.stopByLocations && (
              <Text style={styles.additionalStopsLabel}>
                {t("additionalStops")}
              </Text>
            )}
            {stopByLocations.map((location, index) => (
              <Text key={index} style={styles.stopLocationText}>
                {location}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  ) : (
    <View style={styles.card} key={item.id}>
      <View style={styles.textContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.userInfoContainer}
            onPress={() => {
              router.push(`/userdetails/${item.userId}`);
            }}
          >
            <Image
              source={
                item.imageUri !== "noimage.jpg"
                  ? { uri: item.imageUri }
                  : require("../assets/images/user.jpg")
              }
              style={styles.profileImage}
            />
            <Text style={styles.userName}>
              {truncateName(`${item.firstName} ${item.lastName}`, 25)}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <TouchableOpacity onPress={() => onEditClick?.(item)}>
              <Ionicons name="pencil" size={20} color="#4797C8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete()}>
              <Feather name="trash-2" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={styles.title}
          onPress={() => {
            if (isCoordinates && pickupLocation) {
              handleMapOpen(pickupLocation);
            }
          }}
        >
          {isDriver && item.seatsAvailable !== undefined ? (
            <>
              {`${t("cardTexts.lHave")} ${item.seatsAvailable} ${
                //@ts-ignore
                item.seatsAvailable > 1
                  ? t("cardTexts.freeSeats")
                  : t("cardTexts.freeSeat")
              } ${t("cardTexts.from")} `}
              <Text style={{ fontWeight: "600" }}>{item.startingLocation}</Text>
              {` ${t("cardTexts.to")} `}
              <Text style={{ fontWeight: "600" }}>{item.endLocation}</Text>
              {` ${t("onDate")} ${item.date}. ${pickupMessage} ${t(
                "cardTexts.at"
              )} ${item.time}.`}
            </>
          ) : isPassenger && item.seatsNeeded !== undefined ? (
            <>
              {`${t("cardTexts.iNeed")} ${item.seatsNeeded} ${
                //@ts-ignore
                item.seatsNeeded > 1
                  ? t("cardTexts.seats2")
                  : t("cardTexts.seats")
              } ${t("cardTexts.from")} `}
              <Text style={{ fontWeight: "600" }}>{item.startingLocation}</Text>
              {` ${t("cardTexts.to")} `}
              <Text style={{ fontWeight: "600" }}>{item.endLocation}</Text>
              {` ${t("onDate")} ${item.date} ${t(
                "cardTexts.withLatestArrivalTime"
              )} ${item.time}.`}
            </>
          ) : (
            ""
          )}
        </Text>
        <>
          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={toggleExpand}
          >
            <Text style={styles.readMoreText}>{t("readMore")}</Text>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={isThemeWhite ? "black" : "white"}
            />
          </TouchableOpacity>
          {isExpanded && (
            <View style={styles.additionalStopsContainer}>
              {item.price && (
                <Text style={styles.priceText}>
                  {item.type === "driver"
                    ? `${t("price")}: ${item.price}мкд`
                    : item.showPrice
                    ? `${t("Paying")}: ${item.price}мкд`
                    : `${t("Paying")}: ${t("passengerPriceText")}мкд`}
                </Text>
              )}
              {item.phoneNumber && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}
                >
                  <Text style={styles.priceText}>
                    {`${t("phoneNumber")}: ${item.phoneNumber}`}
                  </Text>
                </TouchableOpacity>
              )}
              {item.stopByLocations && (
                <Text style={styles.additionalStopsLabel}>
                  {t("additionalStops")}
                </Text>
              )}
              {item.type === "passenger" && (
                <TouchableOpacity>
                  <Text style={styles.priceText}>
                    {t("cardTexts.luggage")}:{" "}
                    {item.luggage || t("cardTexts.none")}
                  </Text>
                </TouchableOpacity>
              )}
              {stopByLocations.map((location, index) => (
                <Text key={index} style={styles.stopLocationText}>
                  {location}
                </Text>
              ))}
            </View>
          )}
        </>
      </View>
    </View>
  );
};

export default PostItem;
