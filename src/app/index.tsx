import React, { useState } from "react";
import SplashScreen from "./Splash";
import InputComponent from "../components/InputComponent";
import { Image, SafeAreaView, View } from "react-native";
import ButtonComponent from "../components/ButtonComponent";
import OnBoarding from "./OnBoarding";
import { appInfo } from "../constants/appInfo";

const HomeScreen = () => {
  const [demo, setDemo] = useState<string>("");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnBoarding />
    </SafeAreaView>
  );
};

export default HomeScreen;
