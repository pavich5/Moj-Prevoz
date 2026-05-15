import React, { useRef, useEffect, useState } from "react";
import {
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Modal,
  Pressable,
  Alert,
  Linking,
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../assets/styles/MessegesStyles";
import { useTranslation } from "react-i18next";
import { SelectedSender } from "@/app/messages";
import { useRouter } from "expo-router";
import { truncateName } from "@/hooks/helper";
import * as Location from "expo-location";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { getImgbbUploadUrl } from "@/constants/config";

interface Message {
  id: number;
  sender: string;
  message: string;
  image?: string;
  messageStatus: 1 | 2 | 3;
  senderId: string;
}

interface SelectedSenderDetailsProps {
  messages: Message[];
  selectedSender: SelectedSender | null;
  isDarkTheme: boolean;
  messageInput: string;
  setMessageInput: (text: string) => void;
  handleSendMessage: (message?: string) => void;
  deleteMessage: (messegeId: number) => void;
  fetchMoreMessagesWithSender: (skip: number, take: number) => Promise<void>;
  hasMoreMessages: boolean;
}

const SelectedSenderDetails: React.FC<SelectedSenderDetailsProps> = ({
  messages,
  selectedSender,
  isDarkTheme,
  messageInput,
  setMessageInput,
  handleSendMessage,
  deleteMessage,
  fetchMoreMessagesWithSender,
  hasMoreMessages,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const flatListRef = useRef<FlatList<Message>>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [counter, setCounter] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleFetchMoreMessages = async () => {
    if (!isFetching && hasMoreMessages && hasInitialized) {
      setIsFetching(true);
      const newSkip = counter * 10;
      await fetchMoreMessagesWithSender(newSkip, 10);
      setCounter((prev) => prev + 1);
      setTimeout(() => setIsFetching(false), 300);
    }
  };
  const selectedSenderId = String(selectedSender?.id);

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    const timer = setTimeout(() => setHasInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLongPress = (message: Message) => {
    setSelectedMessage(message);
    setMenuVisible(true);
  };

  const handleDeleteMessage = () => {
    Alert.alert(
      t("chatDm.deleteMessage"),
      t("chatDm.deleteMessageConfirmation"),
      [
        { text: t("chatDm.cancel"), style: "cancel" },
        {
          text: t("chatDm.delete"),
          style: "destructive",
          onPress: () => deleteMessage(selectedMessage?.id ?? 0),
        },
      ],
      { cancelable: true }
    );
    setMenuVisible(false);
  };

  const handleCopyMessage = () => {
    if (selectedMessage) {
      Clipboard.setString(selectedMessage.message);
      Alert.alert(t("chatDm.copySuccess"), t("chatDm.messageCopied"));
    }
    setMenuVisible(false);
  };

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("chatDm.permissionDenied"),
          t("chatDm.locationPermissionRequired")
        );
        return;
      }
  
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
  
      if (!location?.coords) {
        Alert.alert(t("chatDm.error"), t("chatDm.locationUnavailable"));
        return;
      }
  
      const { latitude, longitude } = location.coords;
      const locationMessage = `https://www.google.com/maps?q=${latitude},${longitude}`;
      handleSendMessage(locationMessage);
      setShowOptions(false);
    } catch (error) {
      console.error("Location request error:", error); // Log for debugging
      Alert.alert(
        t("chatDm.error"),
        //@ts-ignore
        t("chatDm.locationFetchError") + ` (${error.message || "Unknown error"})`
      );
    }
  };

  const handleShareLocation = () => {
    Alert.alert(
      t("chatDm.shareLocation"),
      t("chatDm.shareLocationConfirmation"),
      [
        { text: t("chatDm.cancel"), style: "cancel" },
        { text: t("chatDm.yes"), onPress: requestLocation },
      ]
    );
  };

  const uploadImage = async (uri: string) => {
    try {
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500, height: 500 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      const formData = new FormData();
      //@ts-ignore
      formData.append("image", {
        uri: compressedImage.uri,
        name: "image.jpg",
        type: "image/jpeg",
      });

      const response = await axios.post(getImgbbUploadUrl(), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data.url;
    } catch (error) {
      console.error(error);
      return "noimage.jpg";
    }
  };

  const handleImagePick = async () => {
    setShowOptions(false);

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    let fileUri;
    if (result.canceled) {
      const cameraResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!cameraResult.canceled) {
        fileUri = cameraResult.assets[0].uri;
      } else {
        return;
      }
    } else {
      fileUri = result.assets[0].uri;
    }

    if (fileUri) {
      const uploadedUrl = await uploadImage(fileUri);
      if (uploadedUrl) {
        handleSendMessage(uploadedUrl);
      }
    }
  };

  const renderStatus = (status: number) => {
    switch (status) {
      case 1:
        return <Ionicons name="checkmark-done" size={16} color="gray" />;
      case 2:
        return (
          <Ionicons name="checkmark-done" size={16} color="rgb(18 177 128)" />
        );
      case 3:
        return <Ionicons name="close-circle" size={12} color="red" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (scrollOffset === 0) {
      flatListRef.current?.scrollToOffset({ offset: 50, animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDarkTheme ? "black" : "#EFEFEF" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => {
              if (item.senderId !== selectedSenderId) {
                handleLongPress(item);
                return;
              }
              setSelectedMessage(item);
              handleCopyMessage();
            }}
            delayLongPress={250}
          >
            <View
              style={[
                styles.messageItem,
                {
                  backgroundColor: isDarkTheme ? "#3A3A3C" : "#FFFFFF",
                  flexDirection:
                    item.senderId !== selectedSenderId ? "row-reverse" : "row",
                  alignSelf:
                    item.senderId === selectedSenderId
                      ? "flex-start"
                      : "flex-end",
                  opacity: item.messageStatus === 3 ? 0.6 : 1,
                  position: "relative",
                },
              ]}
            >
              {item.senderId === selectedSenderId && (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/userdetails/${selectedSenderId}`)
                  }
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.senderImage}
                  />
                </TouchableOpacity>
              )}
              <View style={{ maxWidth: "100%", flexShrink: 1 }}>
                {item.senderId === selectedSenderId && (
                  <Text
                    style={[
                      styles.messageSender,
                      { color: isDarkTheme ? "#E0E0E0" : "#1C1C1E" },
                    ]}
                  >
                    {truncateName(item.sender, 24)}
                  </Text>
                )}
                <Text
                  style={[
                    styles.messageContent,
                    {
                      color: isDarkTheme ? "#D1D1D6" : "#1C1C1E",
                      wordWrap: "break-word",
                    },
                  ]}
                >
                  {item.message?.startsWith("https://www.google.com/maps") ? (
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(item.message);
                      }}
                    >
                      <Text style={{ color: isDarkTheme ? "#4fa3d1" : "blue" }}>
                        {item.message}
                      </Text>
                    </TouchableOpacity>
                  ) : item.message?.startsWith("https://i.ibb.co") ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedImage(item.message);
                        setImageModalVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: item.message }}
                        style={{
                          width: 200,
                          height: 200,
                          borderRadius: 10,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    item.message
                  )}
                </Text>
              </View>

              {item.senderId !== selectedSenderId && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 3,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {renderStatus(item.messageStatus)}
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
        onScroll={(e) => setScrollOffset(e.nativeEvent.contentOffset.y)}
        onStartReached={handleFetchMoreMessages}
        onStartReachedThreshold={0.1}
        onContentSizeChange={() => {
          if (counter === 1) scrollToEnd();
        }}
        ListEmptyComponent={
          <Text
            style={{
              color: isDarkTheme ? "#D1D1D6" : "#1C1C1E",
              fontSize: 16,
              textAlign: "center",
              paddingBottom: 25,
            }}
          >
            No messages yet. Start a conversation!
          </Text>
        }
      />

      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.modalMenu}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleCopyMessage}
            >
              <Text style={styles.modalText}>{t("chatDm.copy")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleDeleteMessage}
            >
              <Text style={[styles.modalText, { color: "red" }]}>
                {t("chatDm.delete")}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setImageModalVisible(false)}
        >
          <View style={styles.modalImageContainer}>
            <Image
              source={{ uri: selectedImage ?? "" }}
              style={styles.modalImage}
            />
          </View>
        </Pressable>
      </Modal>

      <View style={styles.inputContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity
            onPress={() => setShowOptions(!showOptions)}
            style={[
              styles.plusButton,
              { backgroundColor: isDarkTheme ? "#333" : "#e0e0e0" },
            ]}
          >
            <Ionicons
              name="add-circle"
              size={30}
              color={isDarkTheme ? "#FFFFFF" : "#000000"}
            />
          </TouchableOpacity>

          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: isDarkTheme ? "#3A3A3C" : "white",
                borderColor: isDarkTheme ? "#2C2C2E" : "white",
                color: isDarkTheme ? "white" : "black",
              },
            ]}
            value={messageInput}
            onChangeText={setMessageInput}
            onFocus={scrollToEnd}
            placeholder={t("chatDm.placeholder")}
            placeholderTextColor={isDarkTheme ? "#8E8E93" : "black"}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            handleSendMessage(messageInput);
            setMessageInput("");
          }}
          style={styles.sendButton}
        >
          <Ionicons name="send" style={{marginLeft: 2}} size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {showOptions && (
          <View
            style={{
              position: "absolute",
              bottom: 40,
              left: "13%",
              width: "80%",
              backgroundColor: isDarkTheme ? "#333" : "#fff",
              borderRadius: 10,
              padding: 15,
              shadowColor: isDarkTheme ? "#000" : "#ddd",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={handleImagePick}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 15,
                backgroundColor: isDarkTheme ? "#444" : "#f0f0f0",
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <Ionicons
                name="image"
                size={20}
                color={isDarkTheme ? "#FFFFFF" : "#000000"}
              />
              <Text
                style={{
                  color: isDarkTheme ? "#fff" : "#333",
                  fontSize: 16,
                  marginLeft: 15,
                }}
              >
                {t("chatDm.sendImage")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShareLocation}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 15,
                backgroundColor: isDarkTheme ? "#444" : "#f0f0f0",
                borderRadius: 8,
              }}
            >
              <Ionicons
                name="location"
                size={20}
                color={isDarkTheme ? "#FFFFFF" : "#000000"}
              />
              <Text
                style={{
                  color: isDarkTheme ? "#fff" : "#333",
                  fontSize: 16,
                  marginLeft: 15,
                }}
              >
                {t("chatDm.shareLocation")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default SelectedSenderDetails;
