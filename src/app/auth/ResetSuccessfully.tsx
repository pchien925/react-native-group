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
import { useRouter } from "expo-router";

const ResetSuccessfully = () => {
  const router = useRouter();

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
        <ButtonComponent
          text="Quay lại trang chủ"
          onPress={() => {
            router.push("/auth/Login");
          }}
          type="primary"
          styles={{ width: "100%" }}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ResetSuccessfully;
