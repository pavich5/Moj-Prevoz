import React from "react";
import { View,StyleSheet } from "react-native";
import LottieView from "lottie-react-native"; 

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/lotties/Animation - 1735917653771.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", 
  },
  animation: {
    width: '100%',
    height: "60%",
    marginBottom: 20,
  },
});

export default LoadingScreen;
