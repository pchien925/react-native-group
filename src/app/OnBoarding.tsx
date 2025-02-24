import { View, Text, Image, ImageBackground, Button } from "react-native";
import React from "react";
import { appInfo } from "../constants/appInfo";

import { appColors } from "../constants/appColors";
import TextComponent from "../components/TextComponent";
import ButtonComponent from "../components/ButtonComponent";
import SectionComponent from "../components/SectionComponent";
import { useRouter } from "expo-router";

const OnBoarding = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/onBoarding.png")}
      style={{
        flex: 1,
      }}
      resizeMode="cover"
    >
      <View style={{ flex: 2 }}>
        <TextComponent
          text="Chào mừng bạn đến với Pizza Hut"
          numberOfLines={2}
          color={appColors.white}
          size={38}
          styles={{ marginTop: 100, fontWeight: "bold", paddingHorizontal: 20 }}
        />
      </View>
      <View style={{ flex: 1 }}></View>
      <View style={{ backgroundColor: appColors.white, flex: 1.2 }}>
        <SectionComponent>
          <TextComponent
            text="Đăng nhập để nhận các ưu đãi hấp dẫn!!"
            color={appColors.black}
            size={24}
            styles={{ marginVertical: 8 }}
          />
          <ButtonComponent
            text="Đăng nhập"
            type="primary"
            color={appColors.primary}
            styles={{ width: "100%", paddingVertical: 12 }}
            onPress={() => router.push("/auth/Login")}
          />
          <ButtonComponent
            text="Tiếp tục mà không đăng nhập"
            type="primary"
            color={appColors.gray4}
            styles={{
              width: "100%",
              paddingVertical: 12,
            }}
            onPress={() => console.log("Đăng kí")}
          />
        </SectionComponent>
      </View>
    </ImageBackground>
  );
};

export default OnBoarding;
