import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "../assets/styles/MyProfileStyles";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";

interface PersonalDetailsProps {
  profileImage?: string;
  editableFields: {
    firstName: string;
    lastName: string;
  };
  joinedDate: string;
  isDarkTheme: boolean;
  handleSave: () => void;
  handleImagePick: () => void;
  setEditableFields: (fields: { firstName: string; lastName: string }) => void;
  phoneNumber: string;
  email: string;
  isProfilePictureLoading: boolean;
  handleDeleteUser: () => void;
}

const PersonalDetailsTab: React.FC<PersonalDetailsProps> = ({
  profileImage,
  editableFields,
  joinedDate,
  isDarkTheme,
  handleSave,
  handleImagePick,
  setEditableFields,
  email,
  phoneNumber,
  isProfilePictureLoading,
  handleDeleteUser,
}) => {
  const { t } = useTranslation();
  const [isDeleteUserModalVisable, setIsDeleteUserModalVisable] =
    useState(false);


  return (
    <ScrollView style={styles.scrollView}>
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => {
          Alert.alert(
            t("Delete"),
            t("areYouSureDeleteUser"),
            [
              { text: t("editPost.cancel"), style: "cancel" },
              {
                text: t("Delete"),
                style: "destructive",
                onPress: () => handleDeleteUser(),
              },
            ],
            { cancelable: true }
          );
        }}
      >
        <Feather name="trash-2" size={24} color="#FF3B30" />
      </TouchableOpacity>
      <View style={styles.profileInfo}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.profileImageContainer}
        >
          {isProfilePictureLoading ? (
            <View style={styles.profileImage}>
              <ActivityIndicator size="large" color="#2E2E2E" />
            </View>
          ) : (
            <Image
              source={
                profileImage !== "noimage.jpg"
                  ? { uri: profileImage }
                  : require("../assets/images/user.jpg")
              }
              resizeMode="cover"
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
        <Text
          style={[styles.name, { color: isDarkTheme ? "#E0E0E0" : "#000" }]}
        >
          {editableFields?.firstName} {editableFields?.lastName}
        </Text>
        <Text
          style={[
            styles.joinedDate,
            { color: isDarkTheme ? "#8E8E93" : "#8E8E93" },
          ]}
        >
          {t("Joined in")} {joinedDate}
        </Text>
      </View>

      <View
        style={[
          styles.inputGroup,
          {
            backgroundColor: isDarkTheme ? "#2C2C2E" : "#fff",
            borderColor: isDarkTheme ? "#3A3A3C" : "#D1D1D6",
          },
        ]}
      >
        <Icon
          name="person-outline"
          size={20}
          color={isDarkTheme ? "#8E8E93" : "#8E8E93"}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: isDarkTheme ? "#E0E0E0" : "#000" }]}
          value={editableFields.firstName}
          onChangeText={(text) =>
            setEditableFields({ ...editableFields, firstName: text })
          }
          placeholder={t("First Name")}
          maxLength={40}
        />
      </View>

      <View
        style={[
          styles.inputGroup,
          {
            backgroundColor: isDarkTheme ? "#2C2C2E" : "#fff",
            borderColor: isDarkTheme ? "#3A3A3C" : "#D1D1D6",
          },
        ]}
      >
        <Icon
          name="person-outline"
          size={20}
          color={isDarkTheme ? "#8E8E93" : "#8E8E93"}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: isDarkTheme ? "#E0E0E0" : "#000" }]}
          value={editableFields.lastName}
          onChangeText={(text) =>
            setEditableFields({ ...editableFields, lastName: text })
          }
          placeholder={t("Last Name")}
          maxLength={40}
        />
      </View>
      <View
        style={[
          styles.inputGroup,
          {
            backgroundColor: isDarkTheme ? "#2C2C2E" : "#fff",
            borderColor: isDarkTheme ? "#3A3A3C" : "#D1D1D6",
            opacity: 0.6,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="call-outline"
              size={20}
              color={isDarkTheme ? "#8E8E93" : "#8E8E93"}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                { color: isDarkTheme ? "#E0E0E0" : "#000" },
              ]}
              placeholder={t("Enter Phone Number")}
              value={phoneNumber}
              editable={false}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View
        style={[
          styles.inputGroup,
          {
            backgroundColor: isDarkTheme ? "#2C2C2E" : "#fff",
            borderColor: isDarkTheme ? "#3A3A3C" : "#D1D1D6",
            opacity: 0.6,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="mail-outline"
              size={20}
              color={isDarkTheme ? "#8E8E93" : "#8E8E93"}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                { color: isDarkTheme ? "#E0E0E0" : "#000" },
              ]}
              value={email}
              placeholder={t("Email")}
              editable={false}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: "#4797C8",
          },
        ]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>{t("Save")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PersonalDetailsTab;
