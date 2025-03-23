import { View, Text, Image, StyleProp, ViewStyle } from "react-native";
import React from "react";
import { globalStyles } from "../styles/globalStyles"; // Giả sử bạn có file này
import { appColors } from "../constants/appColors";

interface IProps {
  name?: string;
  size?: number;
  bgColor?: string;
  src?: string;
  styles?: StyleProp<ViewStyle>;
}

const UserAvatarComponent = (props: IProps) => {
  const {
    name = "Guest",
    size = 50,
    bgColor = appColors.gray,
    src,
    styles,
  } = props;
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        styles,
      ]}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            globalStyles.text,
            {
              color: appColors.white,
              fontSize: size / 3, // Kích thước chữ dựa trên size
            },
          ]}
        >
          {name.charAt(0).toUpperCase()} {/* Hiển thị chữ cái đầu */}
        </Text>
      )}
    </View>
  );
};

export default UserAvatarComponent;
