import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import React from "react";
import RowComponent from "./RowComponent";
import { useRouter } from "expo-router";
import { appColors } from "../constants/appColors";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextComponent from "./TextComponent";
import { fontFamilies } from "../constants/fontFamilies";
import { globalStyles } from "../styles/globalStyles";

interface IProps {
  isImageBackground?: boolean;
  isScrollable?: boolean;
  title?: string;
  children?: React.ReactNode;
  back?: boolean;
}

const ContainerComponent = (props: IProps) => {
  const { isImageBackground, isScrollable, title, children, back } = props;
  const router = useRouter();

  const headerComponent = () => {
    return (
      <View style={{ flex: 1, paddingTop: 4 }}>
        {(title || back) && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: "flex-start",
            }}
          >
            {back && (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginRight: 12 }}
              >
                <AntDesign name="arrowleft" size={24} color={appColors.text} />
              </TouchableOpacity>
            )}
            {title ? (
              <TextComponent
                text={title}
                size={16}
                font={fontFamilies.medium}
                flex={1}
              />
            ) : (
              <></>
            )}
          </RowComponent>
        )}
        {returnContainer}
      </View>
    );
  };

  const returnContainer = isScrollable ? (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{children}</View>
  );

  return isImageBackground ? (
    <ImageBackground
      source={require("../assets/images/onBoarding.png")}
      style={{ flex: 1 }}
      imageStyle={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>{headerComponent()}</SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      {headerComponent()}
    </SafeAreaView>
  );
};

export default ContainerComponent;
