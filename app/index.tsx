import { View, Text, Button } from "react-native";
import React from "react";
import LoginScreen from "./(auth)/login";
import ButtonComponent from "@/components/common/ButtonComponent";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <ButtonComponent
        onPress={() => router.push("/SplashScreen")}
        title="Click Me"
      ></ButtonComponent>
    </View>
  );
};

export default index;
