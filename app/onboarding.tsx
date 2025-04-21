// screens/OnboardingScreen.tsx
import React, { useState, useRef, useCallback } from "react";
import { FlatList, Dimensions, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import ImageComponent from "@/components/common/ImageComponent";
import RowComponent from "@/components/common/RowComponent";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");

const onboardingData = [
  {
    image: "https://img.dominos.vn/cach-nuong-pizza-chuan-0.jpg",
    title: "Chào mừng đến với Pizza App",
    subtitle: "Khám phá những chiếc pizza ngon lành được làm bằng tình yêu.",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeo_JMT1ZvwUNMHneItLQcNgYbwRsSs2mqYA&s",
    title: "Tùy chỉnh đơn hàng của bạn",
    subtitle: "Chọn topping và nước chấm yêu thích của bạn.",
  },
  {
    image:
      "https://daylambanh.edu.vn/wp-content/uploads/2024/04/cach-lam-banh-pizza.jpg",
    title: "Giao hàng nhanh chóng",
    subtitle: "Nhận pizza của bạn nóng hổi và tươi ngon.",
  },
];

const OnboardingScreen = () => {
  console.log("OnboardingScreen rendered");
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleFinish = useCallback(async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/login");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  }, [currentIndex, handleFinish]);

  const handleSkip = useCallback(() => {
    handleFinish();
  }, [handleFinish]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof onboardingData)[0] }) => (
      <View style={[styles.slide, { width }]}>
        <ImageComponent
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <SpaceComponent size={24} />
        <TextComponent
          type="heading"
          style={[
            styles.title,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
        >
          {item.title}
        </TextComponent>
        <TextComponent
          type="body"
          style={[
            styles.subtitle,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            },
          ]}
        >
          {item.subtitle}
        </TextComponent>
      </View>
    ),
    [isDarkMode]
  );

  const renderDot = useCallback(
    (_: (typeof onboardingData)[0], index: number) => (
      <View
        key={index}
        style={[
          styles.dot,
          {
            backgroundColor:
              index === currentIndex
                ? isDarkMode
                  ? Colors.accent
                  : Colors.primary
                : isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
          },
        ]}
      />
    ),
    [currentIndex, isDarkMode]
  );

  return (
    <ContainerComponent
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
        },
      ]}
    >
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      <RowComponent
        alignItems="center"
        justifyContent="space-between"
        style={[
          styles.footer,
          {
            backgroundColor: isDarkMode ? Colors.crust : Colors.white,
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
      >
        <ButtonComponent
          title="Bỏ qua"
          type="text"
          onPress={handleSkip}
          textStyle={[
            styles.buttonText,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            },
          ]}
        />
        <RowComponent style={styles.dots}>
          {onboardingData.map(renderDot)}
        </RowComponent>
        <ButtonComponent
          title={
            currentIndex === onboardingData.length - 1 ? "Bắt đầu" : "Tiếp theo"
          }
          type="primary"
          onPress={handleNext}
          style={[
            styles.nextButton,
            {
              backgroundColor: isDarkMode ? Colors.primary : Colors.accent,
            },
          ]}
          textStyle={[
            styles.buttonText,
            {
              color: Colors.white,
              fontWeight: "700",
            },
          ]}
        />
      </RowComponent>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dots: {
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingScreen;
