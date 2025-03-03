import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import ContainerComponent from "@/src/components/ContainerComponent";
import SectionComponent from "@/src/components/SectionComponent";
import { appInfo } from "@/src/constants/appInfo";
import TextComponent from "@/src/components/TextComponent";
import InputComponent from "@/src/components/InputComponent";
import { appColors } from "@/src/constants/appColors";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import SpaceComponent from "@/src/components/SpaceComponent";
import ButtonComponent from "@/src/components/ButtonComponent";
import SocialLogin from "@/src/components/SocialLogin";
import RowComponent from "@/src/components/RowComponent";
import { useRouter } from "expo-router";
import { loginApi } from "@/src/services/api";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    try {
      console.log(email, password);
      const res = await loginApi(email, password);
      if (res.data) {
        console.log(res.data);
      } else {
        console.log(res?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ContainerComponent isScrollable back>
      <SectionComponent
        styles={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("@/src/assets/images/aaa.png")}
          style={{
            width: appInfo.sizes.WIDTH * 0.7,
            height: appInfo.sizes.HEIGHT * 0.12,
          }}
        />
      </SectionComponent>
      <SectionComponent
        styles={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextComponent
          text="Đăng Nhập"
          size={28}
          styles={{ fontWeight: "bold" }}
        />
        <TextComponent
          text="Đăng nhập để tích điểm và đổi những ưu đãi chỉ dành riêng cho thành viên bạn nhé!"
          size={13}
          color={appColors.gray}
          styles={{ textAlign: "center" }}
        />
      </SectionComponent>
      <SpaceComponent height={10} />
      <SectionComponent>
        <InputComponent
          placeholder="Email"
          value={email}
          onChange={setEmail}
          affix={<Fontisto name="email" size={24} color={appColors.text} />}
          keyboardType="email-address"
        />
        <InputComponent
          placeholder="Password"
          value={password}
          onChange={setPassword}
          affix={<AntDesign name="lock" size={24} color="black" />}
          isPassword
        />
        <RowComponent justifyContent="flex-end">
          <ButtonComponent
            text="Quên mật khẩu?"
            type="link"
            onPress={() => {
              router.push("/auth/ForgotPassword");
            }}
          />
        </RowComponent>
        <SpaceComponent height={24} />
        <ButtonComponent
          text="Đăng Nhập"
          onPress={() => {
            handleLogin();
          }}
          type="primary"
          styles={{ width: "100%" }}
        />
      </SectionComponent>
      <SocialLogin />
      <SectionComponent>
        <RowComponent
          styles={{
            justifyContent: "center",
          }}
        >
          <TextComponent text="Bạn chưa có tài khoản?" />
          <ButtonComponent
            text="Đăng Ký"
            type="link"
            onPress={() => {
              router.push("/auth/Register");
            }}
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default Login;
