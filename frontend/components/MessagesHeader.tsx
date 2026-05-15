import React from "react";
import { View, TouchableOpacity, Text, Image, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "../assets/styles/MessegesStyles";
import { truncateName } from "@/hooks/helper";

interface HeaderProps {
  selectedSender: { id: string; name: string } | null;
  allSenders: { id: string; name: string }[];
  isDarkTheme: boolean;
  language: string;
  t: (key: string) => string;
  handleBack: (isSenderSelected: boolean) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  ukFlag: any;
  macedonianFlag: any;
}

const MessegesHeader: React.FC<HeaderProps> = ({
  selectedSender,
  allSenders,
  isDarkTheme,
  language,
  t,
  handleBack,
  toggleTheme,
  toggleLanguage,
  ukFlag,
  macedonianFlag,
}) => {
  const headerTitle = selectedSender?.name
    ? selectedSender?.name || t("messeges")
    : t("myMessages");

  return (
    <>
      <StatusBar
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor={isDarkTheme ? "black" : "white"}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkTheme ? "black" : "white",
            paddingLeft: 5,
            paddingRight: 5,
          },
        ]}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              handleBack(Boolean(selectedSender?.id));
            }}
          >
            <Icon
              name="chevron-left"
              size={24}
              color={isDarkTheme ? "#E0E0E0" : "#2B2D42"}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                color: isDarkTheme ? "#E0E0E0" : "#2B2D42",
                marginLeft: 10,
              },
            ]}
          >
            {truncateName(headerTitle, 22)}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={toggleLanguage} style={styles.flagToggle}>
            <Image
              source={language === "en" ? ukFlag : macedonianFlag}
              style={styles.flagIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default MessegesHeader;
