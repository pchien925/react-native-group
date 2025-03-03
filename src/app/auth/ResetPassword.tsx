import { Image } from "react-native";
import React from "react";
import ContainerComponent from "@/src/components/ContainerComponent";
import SectionComponent from "@/src/components/SectionComponent";
import { appInfo } from "@/src/constants/appInfo";
import TextComponent from "@/src/components/TextComponent";
import InputComponent from "@/src/components/InputComponent";
import { appColors } from "@/src/constants/appColors";
import SpaceComponent from "@/src/components/SpaceComponent";
import ButtonComponent from "@/src/components/ButtonComponent";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useRouter } from "expo-router";

const ResetPassword = () => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const router = useRouter();
  const handleLogin = async () => {};

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
        <TextComponent
          text="Thay đổi mật khẩu"
          size={28}
          styles={{ fontWeight: "bold" }}
        />
        <TextComponent
          text="Vui lòng nhập mật khẩu mới."
          size={13}
          color={appColors.gray}
          styles={{ textAlign: "center" }}
        />
      </SectionComponent>
      <SpaceComponent height={10} />
      <SectionComponent>
        <InputComponent
          placeholder="Mật khẩu"
          value={password}
          onChange={setPassword}
          affix={<AntDesign name="lock" size={24} color="black" />}
          keyboardType="default"
          isPassword
        />
        <InputComponent
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={setConfirmPassword}
          affix={<AntDesign name="lock" size={24} color="black" />}
          keyboardType="default"
          isPassword
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          text="Xác nhận"
          onPress={() => {
            handleLogin();
            router.push("/auth/ResetSuccessfully");
          }}
          type="primary"
          styles={{ width: "100%" }}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ResetPassword;
