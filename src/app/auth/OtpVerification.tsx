import { Image } from "react-native";
import React from "react";
import ContainerComponent from "@/src/components/ContainerComponent";
import SectionComponent from "@/src/components/SectionComponent";
import { appInfo } from "@/src/constants/appInfo";
import TextComponent from "@/src/components/TextComponent";
import { appColors } from "@/src/constants/appColors";
import SpaceComponent from "@/src/components/SpaceComponent";
import ButtonComponent from "@/src/components/ButtonComponent";
import RowComponent from "@/src/components/RowComponent";
import { OtpInput } from "react-native-otp-entry";
import { router, useRouter } from "expo-router";

const OtpVerification = () => {
  const [otp, setOtp] = React.useState("");
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
          text="Vui lòng nhập mã xác thực OTP đã được gửi đến email bạn đã đăng kí."
          size={13}
          color={appColors.gray}
          styles={{ textAlign: "center" }}
        />
      </SectionComponent>
      <SpaceComponent height={10} />
      <SectionComponent>
        <OtpInput
          numberOfDigits={6}
          onTextChange={(text) => {
            setOtp(text);
          }}
          focusColor={appColors.primary}
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          text="Xác nhận"
          onPress={() => {
            handleLogin();
            router.push("/auth/ResetPassword");
          }}
          type="primary"
          styles={{ width: "100%" }}
        />
      </SectionComponent>
      <SectionComponent>
        <RowComponent>
          <TextComponent
            text="Chưa nhận được mã?"
            size={16}
            color={appColors.black}
            styles={{ textAlign: "center" }}
          />
          <SpaceComponent width={5} />
          <ButtonComponent text="Gửi lại" type="link" onPress={() => {}} />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default OtpVerification;
