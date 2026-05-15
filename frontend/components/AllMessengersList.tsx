import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Text,
  ScrollView,
} from "react-native";
import { styles } from "../assets/styles/MessegesStyles";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import { truncateName } from "@/hooks/helper";
import { format } from "date-fns";

interface Sender {
  id: string;
  name: string;
  image: string;
  newMessagesCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

interface AllMessengersListProps {
  isDarkTheme: boolean;
  searchQuery: string;
  handleSearch: (text: string) => void;
  filteredSenders: Sender[];
  handleOnSenderClick: (selectedSender: Sender) => void;
  changeNewMessagesCount: (senderId: string) => void
}

const AllMessengersList: React.FC<AllMessengersListProps> = ({
  isDarkTheme,
  searchQuery,
  handleSearch,
  filteredSenders,
  handleOnSenderClick,
  changeNewMessagesCount
}) => {
  const { t } = useTranslation();
  const formatMessageTime = (timestamp: string | number) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "HH:mm");
    } else if (messageDate > oneWeekAgo) {
      return format(messageDate, "EEE");
    } else {
      return format(messageDate, "dd/MM/yyyy");
    }
  };
  return (
    <>
      <View style={styles.searchInputWrapper}>
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: isDarkTheme ? "#2C2C2E" : "#F5F5F5",
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDarkTheme ? "#8E8E93" : "black"}
            style={styles.icon}
          />
          <TextInput
            style={[
              styles.searchInput,
              {
                borderColor: isDarkTheme ? "#262626" : "rgb(18 177 128)",
                backgroundColor: isDarkTheme ? "#2C2C2E" : "#F5F5F5",
                color: isDarkTheme ? "white" : "black",
              },
            ]}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder={t("search.placeholder")}
            placeholderTextColor={isDarkTheme ? "white" : "black"}
          />
        </View>
      </View>
      {/* <View style={{ height: 110 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.circleRow}
          scrollEnabled={true}
        >
          {filteredSenders.map((sender) => (
            <TouchableOpacity
              key={sender.id}
              onPress={() => handleOnSenderClick(sender)}
              style={styles.circleWrapper}
            >
              <Image
                source={{ uri: sender.image }}
                style={styles.circleImage}
              />
              <Text
                style={[
                  styles.circleText,
                  { color: isDarkTheme ? "#FFFFFF" : "#1C1C1E" },
                ]}
              >
                {truncateName(sender.name, 10)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View> */}

      <FlatList
        data={filteredSenders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if(item.newMessagesCount > 0){
                changeNewMessagesCount(item.id)
              }
              handleOnSenderClick(item)
            }}
            style={[
              styles.senderContainer,
              {
                backgroundColor: isDarkTheme ? "black" : "#FFFFFF",
                paddingVertical: 5,
                paddingHorizontal: 10,
                marginBottom: 10,
                borderRadius: 15,
                shadowColor: isDarkTheme ? "#000" : "#ccc",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              },
            ]}
          >
            <View style={styles.senderProfile}>
              <Image
                source={{ uri: item.image }}
                style={styles.senderListImage}
              />
              <View style={styles.senderDetails}>
                <Text
                  style={[
                    styles.senderName,
                    { color: isDarkTheme ? "#FFFFFF" : "#1C1C1E" },
                  ]}
                >
                  {truncateName(item.name, 20)}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.lastMessagePreview,
                      { color: isDarkTheme ? "#B1B1B6" : "#5F5F5F" },
                    ]}
                  >
                    {truncateName(item.lastMessage, 27)}
                  </Text>
                  <Text
                    style={[
                      styles.lastMessagePreview,
                      {
                        color: isDarkTheme ? "#B1B1B6" : "#5F5F5F",
                        marginHorizontal: 5,
                      },
                    ]}
                  >
                    {"\u00b7"}
                  </Text>
                  <Text
                    style={[
                      styles.lastMessagePreview,
                      { color: isDarkTheme ? "#B1B1B6" : "#5F5F5F" },
                    ]}
                  >
                    {formatMessageTime(item.lastMessageTime)}
                  </Text>
                </View>
              </View>
            </View>
            {item.newMessagesCount > 0 ? (
              <View style={styles.newMessageBadge}>
                <Text style={styles.badgeText}></Text>
              </View>
            ) : null}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.sendersList}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <LottieView
              source={require("../assets/lotties/Animation - 1736177411159.json")}
              autoPlay
              loop
              style={styles.emptyAnimation}
            />
            <Text
              style={[
                styles.emptyText,
                { color: isDarkTheme ? "#FFFFFF" : "#1C1C1E" },
              ]}
            >
              {t("noMessages")}
            </Text>
          </View>
        }
      />
    </>
  );
};

export default AllMessengersList;
