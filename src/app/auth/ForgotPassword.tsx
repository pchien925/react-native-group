import { Image } from "react-native";
import React from "react";
import ContainerComponent from "@/src/components/ContainerComponent";
import SectionComponent from "@/src/components/SectionComponent";
import { appInfo } from "@/src/constants/appInfo";
import TextComponent from "@/src/components/TextComponent";
import InputComponent from "@/src/components/InputComponent";
import { appColors } from "@/src/constants/appColors";
import Fontisto from "@expo/vector-icons/Fontisto";
import SpaceComponent from "@/src/components/SpaceComponent";
import ButtonComponent from "@/src/components/ButtonComponent";
import { router, useRouter } from "expo-router";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
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
          text="Quên mật khẩu"
          size={28}
          styles={{ fontWeight: "bold" }}
        />
        <TextComponent
          text="Vui lòng nhập địa chỉ email đã đăng kí của bạn và mã xác thực sẽ được gửi cho bạn ngay lập tức."
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
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          text="Xác nhận"
          onPress={() => {
            handleLogin();
            router.push("/auth/OtpVerification");
          }}
          type="primary"
          styles={{ width: "100%" }}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ForgotPassword;
