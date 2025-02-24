import { View, Text } from "react-native";
import React from "react";
import SectionComponent from "./SectionComponent";
import RowComponent from "./RowComponent";
import { appColors } from "../constants/appColors";
import ButtonComponent from "./ButtonComponent";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const SocialLogin = () => {
  return (
    <SectionComponent styles={{ gap: 10, paddingHorizontal: 0 }}>
      <RowComponent>
        <View
          style={{
            backgroundColor: appColors.gray4,
            height: 1,
            flex: 1,
            marginLeft: 20,
          }}
        />
        <Text style={{ color: appColors.gray4, marginHorizontal: 6 }}>
          Hoặc
        </Text>
        <View
          style={{
            backgroundColor: appColors.gray4,
            height: 1,
            flex: 1,
            marginRight: 20,
          }}
        />
      </RowComponent>

      <SectionComponent>
        <ButtonComponent
          text="Đăng nhập với Facebook"
          type="primary"
          textColor={appColors.text}
          color={appColors.white}
          styles={{ width: "100%" }}
          icon={<FontAwesome5 name="facebook" size={24} color="black" />}
          iconFlex="left"
        />
        <ButtonComponent
          text="Đăng nhập với Google"
          type="primary"
          textColor={appColors.text}
          color={appColors.white}
          styles={{ width: "100%" }}
          icon={<FontAwesome5 name="google" size={24} color="black" />}
          iconFlex="left"
        />
      </SectionComponent>
    </SectionComponent>
  );
};

export default SocialLogin;
