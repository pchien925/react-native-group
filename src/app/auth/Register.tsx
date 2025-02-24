import { View, Text, Image } from "react-native";
import React from "react";
import ContainerComponent from "@/src/components/ContainerComponent";
import SectionComponent from "@/src/components/SectionComponent";
import { appInfo } from "@/src/constants/appInfo";
import TextComponent from "@/src/components/TextComponent";
import { appColors } from "@/src/constants/appColors";
import SpaceComponent from "@/src/components/SpaceComponent";
import InputComponent from "@/src/components/InputComponent";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import ButtonComponent from "@/src/components/ButtonComponent";
import RowComponent from "@/src/components/RowComponent";
import DateTimePickerComponent from "@/src/components/DateTimePickerComponent";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Checkbox from "expo-checkbox";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [sex, setSex] = React.useState("");
  const [date, setDate] = React.useState(new Date());

  return (
    <ContainerComponent isScrollable>
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
          text="Đăng Kí"
          size={28}
          styles={{ fontWeight: "bold" }}
        />
        <TextComponent
          text="Vui lòng điền mẫu đơn đăng kí bên dưới!"
          size={13}
          color={appColors.gray}
          styles={{ textAlign: "center" }}
        />
      </SectionComponent>
      <SpaceComponent height={10} />
      <SectionComponent>
        <InputComponent
          placeholder="Tên của bạn"
          value={name}
          onChange={setName}
          affix={<Ionicons name="person-outline" size={24} color="black" />}
        />
        <DateTimePickerComponent date={date} setDate={setDate} />
        <InputComponent
          placeholder="Giới tính"
          value={sex}
          onChange={setSex}
          affix={
            <FontAwesome name="intersex" size={24} color={appColors.text} />
          }
        />
        <InputComponent
          placeholder="Số điện thoại"
          value={phone}
          onChange={setPhone}
          affix={<FontAwesome name="phone" size={24} color={appColors.text} />}
        />
        <InputComponent
          placeholder="Email"
          value={email}
          onChange={setEmail}
          affix={<Fontisto name="email" size={24} color={appColors.text} />}
          keyboardType="email-address"
        />
        <InputComponent
          placeholder="Mật khẩu"
          value={password}
          onChange={setPassword}
          affix={<AntDesign name="lock" size={24} color="black" />}
          isPassword
        />
        <InputComponent
          placeholder="Xác nhận mật khẩu"
          value={password}
          onChange={setPassword}
          affix={<AntDesign name="lock" size={24} color="black" />}
          isPassword
        />

        <RowComponent justifyContent="flex-start">
          <Checkbox
            value={true}
            color={appColors.primary}
            style={{ borderRadius: 5 }}
          />
          <SpaceComponent width={10} />
          <TextComponent text="Đồng ý với điều khoản và chính sách của chúng tôi." />
        </RowComponent>
        <SpaceComponent height={24} />
        <ButtonComponent
          text="Đăng Kí"
          onPress={() => {}}
          type="primary"
          styles={{ width: "100%" }}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default Register;
