import React, { useState, useEffect } from "react";
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { styles } from "../assets/styles/MessegesStyles";
import AllMessengersList from "@/components/AllMessengersList";
import { useTranslation } from "react-i18next";
import {
  getUserMessengers,
  UserMessengers,
  getMesseges,
} from "@/components/callApi";
import { appConfig } from "@/constants/config";
import { useAuth } from "@/hooks/AuthContext";
import SelectedSenderDetails from "@/components/SelectedSenderDetails";
import { useFocusEffect, useRouter } from "expo-router";
import MessegesHeader from "@/components/MessagesHeader";
import { Filter } from "bad-words";
import { useLocalSearchParams } from "expo-router";

export interface Sender {
  id: string;
  name: string;
  image: string;
}

export interface SelectedSender {
  name: string;
  id: string;
}
interface Message {
  id: number;
  sender: string;
  message: string;
  image?: string;
  senderId: string;
  messageStatus: 1 | 2 | 3;
}

const macedonianFlag = require("../assets/images/macedonianFlage.png");
const ukFlag = require("../assets/images/ukFlag.png");

const MessagingScreen: React.FC = () => {
  const { selectedUserId, selectedUserName } = useLocalSearchParams();
  const [selectedSender, setSelectedSender] = useState<SelectedSender | null>(
    null
  );
  const [ws, setWs] = useState<any>(null);
  const { userId, toggleTheme, isThemeWhite, userDetails, setUserDetails } =
    useAuth();
  const [messageInput, setMessageInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSenders, setFilteredSenders] = useState<UserMessengers[]>([]);
  const [allSenders, setAllSenders] = useState<UserMessengers[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<"mk" | "en">("mk");
  const filter = new Filter();
  const isDarkTheme = !isThemeWhite;

  const changeNewMessagesCount = (senderId: string) => {
    //@ts-ignore
    setUserDetails((prev) => ({
      ...prev,
      newMessagesCount: prev.newMessagesCount - 1,
    }));
    setFilteredSenders((prevSenders) =>
      prevSenders.map((sender) =>
        sender.id === senderId ? { ...sender, newMessagesCount: 0 } : sender
      )
    );
  };
  const fetchSenders = async () => {
    try {
      setLoading(true);
      if (userId) {
        const response = await getUserMessengers({
          userId: Number(userId),
        });
        setAllSenders(response);
        setFilteredSenders(response);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching senders:", err);
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchSenders();
    }, [userDetails?.id])
  );

  const toggleLanguage = () => {
    const newLang = language === "en" ? "mk" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const clearParams = () => {
    router.setParams({
      selectedUserId: undefined,
      selectedUserName: undefined,
    });
  };

  const fetchMoreMessagesWithSender = async (skip = 0, take = 15) => {
    try {
      const fetchedMessages = await getMesseges({
        senderId: Number(userId),
        receiverId: Number(selectedSender?.id),
        skip,
        take,
      });

      console.log("pavic fetchedMessages length", fetchedMessages.length);

      if (!fetchedMessages || fetchedMessages.length === 0) {
        setHasMoreMessages(false);
        console.log("pavic inside has more messages");
        return;
      }

      setMessages((prevMessages) => {
        const allMessages = [...prevMessages, ...fetchedMessages];

        const uniqueMessages = allMessages.filter(
          (message, index, self) =>
            index === self.findIndex((m) => m.id === message.id)
        );

        return uniqueMessages.sort((a, b) => a.id - b.id);
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleOnSenderClick = async (selectedSender: SelectedSender) => {
    setLoading(true);
    setSelectedSender(selectedSender);
    try {
      if (!userId) {
        throw new Error("User ID is undefined.");
      }
      const fetchedMessages = await getMesseges({
        senderId: Number(userId),
        receiverId: Number(selectedSender.id),
        skip: 0,
        take: 15,
      });
      setMessages(fetchedMessages);

      const websocket = new WebSocket(appConfig.webSocketUrl);

      websocket.onopen = () => {
        console.log("WebSocket Connected");
      };

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.action === "delete_message") {
          setMessages((prevMessages) => {
            return [
              ...prevMessages.filter(
                (item) => String(item.id) !== String(message.id)
              ),
            ];
          });
        } else {
          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some(
              (prevMessage) => prevMessage.id === message.id
            );
            if (isDuplicate) {
              return prevMessages;
            }
            return [
              ...prevMessages,
              {
                ...message,
                messageStatus: 1,
              },
            ];
          });
        }
      };

      websocket.onerror = (error) => {
        console.log("WebSocket Error: ", error);
      };

      websocket.onclose = () => {
        console.log("WebSocket Disconnected");
      };

      setWs(websocket);

      setLoading(false);
    } catch (error) {
      console.error("Error in handleSenderPress:", error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (location?: string) => {
    if (filter.isProfane(messageInput.trim().toLowerCase())) {
      Alert.alert(
        "Invalid Input",
        "Please avoid using inappropriate language."
      );
      return;
    }

    if (ws && (messageInput.trim() || location)) {
      if (selectedSender?.id && (location || messageInput.trim())) {
        try {
          const messageData = {
            receiverId: selectedSender?.id.toString(),
            senderId: userDetails?.id.toString(),
            message: location ?? messageInput,
            action: "new_message",
          };
          ws.send(JSON.stringify(messageData));
          setMessageInput("");
        } catch (error) {
          console.error("Failed to send message via WebSocket:", error);
        }
      }
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    try {
      const deleteMessage = {
        action: "delete_message",
        id: String(messageId),
      };
      ws.send(JSON.stringify(deleteMessage));
    } catch (error) {
      console.error("Failed to delete message via WebSocket:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = allSenders.filter((sender) =>
      sender.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSenders(filtered);
  };

  const handleBack = (isFromMessagesDetails: boolean) => {
    if (isFromMessagesDetails) {
      setSelectedSender(null);
      setMessages([]);
      clearParams();
      ws.close();
      setHasMoreMessages(true);
      void fetchSenders();
      return;
    }
    router.back();
  };

  useEffect(() => {
    if (
      selectedUserId &&
      selectedUserName &&
      selectedUserId !== "undefined" &&
      selectedUserName !== "undefined"
    ) {
      handleOnSenderClick({
        id: selectedUserId as string,
        name: selectedUserName as string,
      });
    }
  }, [selectedUserName, selectedUserId]);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDarkTheme ? "black" : "white" },
        ]}
      >
        <MessegesHeader
          selectedSender={selectedSender}
          allSenders={allSenders}
          isDarkTheme={isDarkTheme}
          language={language}
          t={t}
          handleBack={handleBack}
          toggleTheme={toggleTheme}
          toggleLanguage={toggleLanguage}
          ukFlag={ukFlag}
          macedonianFlag={macedonianFlag}
        />
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkTheme ? "black" : "#F5F5F5",
            }}
          >
            <ActivityIndicator
              size="large"
              color={isDarkTheme ? "#2E2E2E" : "#2E2E2E"}
            />
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            {selectedSender?.id ? (
              <SelectedSenderDetails
                messages={messages}
                selectedSender={selectedSender}
                isDarkTheme={isDarkTheme}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                handleSendMessage={handleSendMessage}
                deleteMessage={handleDeleteMessage}
                fetchMoreMessagesWithSender={fetchMoreMessagesWithSender}
                hasMoreMessages={hasMoreMessages}
              />
            ) : (
              <AllMessengersList
                isDarkTheme={isDarkTheme}
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                filteredSenders={filteredSenders}
                handleOnSenderClick={handleOnSenderClick}
                changeNewMessagesCount={changeNewMessagesCount}
              />
            )}
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MessagingScreen;
