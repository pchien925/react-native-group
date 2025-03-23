import React from "react";
import ContainerComponent from "@/src/components/ContainerComponent";
import SectionComponent from "@/src/components/SectionComponent";
import ButtonComponent from "@/src/components/ButtonComponent";
import { appColors } from "@/src/constants/appColors";
import SpaceComponent from "@/src/components/SpaceComponent";
import InputComponent from "@/src/components/InputComponent";
import Fontisto from "@expo/vector-icons/Fontisto";
import DateTimePickerComponent from "@/src/components/DateTimePickerComponent";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import UserAvatarComponent from "@/src/components/UserAvatarComponent";

const Profile = () => {
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [date, setDate] = React.useState(new Date());

  return (
    <ContainerComponent isScrollable back>
      <SectionComponent
        styles={{ justifyContent: "center", alignItems: "center" }}
      >
        <UserAvatarComponent
          size={100}
          name="John Doe"
          bgColor="#ffff" // Lưu ý: #ffff không hợp lệ, nên dùng #ffffff
          src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid"
        />
        <SpaceComponent height={10} />
        <ButtonComponent
          text="Đổi ảnh đại diện"
          onPress={() => {}}
          type="link"
          styles={{ width: "100%" }}
          textColor={appColors.gray4}
        />
      </SectionComponent>
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
          value={gender}
          onChange={setGender}
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
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          text="Cập nhật"
          onPress={() => {
            console.log(date);
          }}
          type="primary"
          styles={{ width: "100%" }}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default Profile;
