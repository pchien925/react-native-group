import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Onboarding from "react-native-onboarding-swiper";
import { Image, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

const onboardingData = [
  {
    backgroundColor: Colors.backgroundLight,
    image: (
      <Image
        source={{ uri: "https://img.dominos.vn/cach-nuong-pizza-chuan-0.jpg" }}
        style={{ width: 220, height: 220, borderRadius: 20, marginBottom: 24 }}
        resizeMode="cover"
      />
    ),
    title: "Chào mừng đến với Pizza App",
    subtitle: "Khám phá những chiếc pizza ngon lành được làm bằng tình yêu.",
  },
  {
    backgroundColor: Colors.backgroundLight,
    image: (
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeo_JMT1ZvwUNMHneItLQcNgYbwRsSs2mqYA&s",
        }}
        style={{ width: 220, height: 220, borderRadius: 20, marginBottom: 24 }}
        resizeMode="cover"
      />
    ),
    title: "Tùy chỉnh đơn hàng của bạn",
    subtitle: "Chọn topping và nước chấm yêu thích của bạn.",
  },
  {
    backgroundColor: Colors.backgroundLight,
    image: (
      <Image
        source={{
          uri: "https://daylambanh.edu.vn/wp-content/uploads/2024/04/cach-lam-banh-pizza.jpg",
        }}
        style={{ width: 220, height: 220, borderRadius: 20, marginBottom: 24 }}
        resizeMode="cover"
      />
    ),
    title: "Giao hàng nhanh chóng",
    subtitle: "Nhận pizza của bạn nóng hổi và tươi ngon.",
  },
];

const OnboardingScreen = () => {
  const { isDarkMode } = useTheme();

  const handleFinish = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/login");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? Colors.backgroundDark
          : Colors.backgroundLight,
      }}
    >
      <Onboarding
        pages={onboardingData.map((item) => ({
          ...item,
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
          titleStyles: {
            fontWeight: "bold",
            fontSize: 22,
            textAlign: "center",
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
          },
          subTitleStyles: {
            fontSize: 16,
            textAlign: "center",
            color: isDarkMode
              ? Colors.textDarkSecondary
              : Colors.textLightSecondary,
          },
        }))}
        showSkip
        showNext
        showDone
        skipLabel="Bỏ qua"
        nextLabel="Tiếp theo"
        doneLabel="Bắt đầu"
        onSkip={handleFinish}
        onDone={handleFinish}
        bottomBarHighlight={false}
      />
    </View>
  );
};

export default OnboardingScreen;
