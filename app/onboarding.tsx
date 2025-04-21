import React, { useState, useRef } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
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
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleFinish = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/login");
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text
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
      </Text>
      <Text
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
      </Text>
    </View>
  );

  return (
    <View
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
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text
            style={[
              styles.buttonText,
              {
                color: isDarkMode
                  ? Colors.textDarkSecondary
                  : Colors.textLightSecondary,
              },
            ]}
          >
            Bỏ qua
          </Text>
        </TouchableOpacity>
        <View style={styles.dots}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex
                      ? isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary
                      : isDarkMode
                      ? Colors.textDarkSecondary
                      : Colors.textLightSecondary,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext}>
          <Text
            style={[
              styles.buttonText,
              {
                color: isDarkMode
                  ? Colors.textDarkPrimary
                  : Colors.textLightPrimary,
              },
            ]}
          >
            {currentIndex === onboardingData.length - 1
              ? "Bắt đầu"
              : "Tiếp theo"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default OnboardingScreen;
