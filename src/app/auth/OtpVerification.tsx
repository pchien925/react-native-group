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
import { useLocalSearchParams, useRouter } from "expo-router";
import { verifyApi } from "@/src/services/api";

const OtpVerification = () => {
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email)
    ? params.email[0]
    : params.email || "";

  const [otp, setOtp] = React.useState("");
  const router = useRouter();
  const handleVerify = async () => {
    try {
      const res = await verifyApi(email, otp);
      if (res.data) {
        console.log(res.data);
        alert("Xác thực thành công");
        router.push("/auth/Login");
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
        <TextComponent
          text="Xác nhận email"
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
            handleVerify();
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
