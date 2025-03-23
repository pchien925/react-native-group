import React from "react";
import { View, StyleProp, ViewStyle, Dimensions, Image } from "react-native";
import Swiper from "react-native-swiper";
import { globalStyles } from "../styles/globalStyles";
import { appColors } from "../constants/appColors";
import TextComponent from "./TextComponent";
import { fontFamilies } from "../constants/fontFamilies";

const { width: screenWidth } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  description: string;
  backgroundColor?: string;
  image?: string;
}

interface SlideshowProps {
  slides: Slide[];
  autoplay?: boolean;
  showButtons?: boolean;
  height?: number;
  styles?: StyleProp<ViewStyle>;
  titleColor?: string;
  descriptionColor?: string;
  titleFont?: string;
  descriptionFont?: string;
}

const Slideshow = (props: SlideshowProps) => {
  const {
    slides,
    autoplay = true,
    showButtons = false,
    height = 200,
    styles,
    titleColor,
    descriptionColor,
    titleFont,
    descriptionFont,
  } = props;

  const renderSlide = (slide: Slide) => (
    <View
      style={[
        globalStyles.container,
        {
          backgroundColor: slide.backgroundColor ?? appColors.primary,
          width: screenWidth,
          height,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        },
      ]}
      key={slide.id}
    >
      {slide.image && (
        <Image
          source={{ uri: slide.image }}
          style={{
            width: screenWidth,
            height,
            resizeMode: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}
      <TextComponent
        text={slide.title}
        color={titleColor ?? appColors.white}
        font={titleFont ?? fontFamilies.bold}
        size={24}
        styles={{
          textAlign: "center",
          position: "absolute",
          top: 20,
          width: "100%",
          textShadowColor: "rgba(0, 0, 0, 0.75)", // Màu bóng: đen với độ mờ 75%
          textShadowOffset: { width: 2, height: 2 }, // Độ lệch bóng
          textShadowRadius: 4, // Độ mờ của bóng
        }}
      />
      <TextComponent
        text={slide.description}
        color={descriptionColor ?? appColors.white}
        font={descriptionFont ?? fontFamilies.regular}
        size={16}
        styles={{
          textAlign: "center",
          position: "absolute",
          bottom: 20,
          width: "100%",
          textShadowColor: "rgba(0, 0, 0, 0.75)", // Màu bóng
          textShadowOffset: { width: 2, height: 2 }, // Độ lệch bóng
          textShadowRadius: 4, // Độ mờ của bóng
        }}
      />
    </View>
  );

  return (
    <View style={[{ height, width: screenWidth }, styles]}>
      <Swiper
        style={{ height }}
        showsButtons={showButtons}
        autoplay={autoplay}
        autoplayTimeout={2.5}
        loop={true}
        showsPagination={true}
      >
        {slides.map((slide) => renderSlide(slide))}
      </Swiper>
    </View>
  );
};

export default Slideshow;
