import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import TextComponent from "@/components/common/TextComponent";
import ImageComponent from "@/components/common/ImageComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/globalStyles";
import { useTheme } from "@/contexts/ThemeContext";

const SplashScreen = () => {
  const { isDarkMode } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Điều hướng sau 1.2s
    const timeout = setTimeout(async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(
          "hasSeenOnboarding"
        );
        const isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
        if (hasSeenOnboarding !== "true") {
          router.replace("/onboarding");
        } else if (isAuthenticated !== "true") {
          router.replace("/login");
        } else {
          router.replace("(tabs)");
        }
      } catch (error) {
        router.replace("/onboarding");
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ContainerComponent style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <ImageComponent
          source={{
            uri: "https://img.dominos.vn/cach-nuong-pizza-chuan-0.jpg",
          }}
          style={styles.logo}
          accessibilityLabel="Logo Pizza App"
        />
        <TextComponent
          type="heading"
          style={[
            globalStyles.textHeading,
            styles.text,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
          accessibilityLabel="Tên ứng dụng Pizza App"
        >
          Pizza App
        </TextComponent>
      </Animated.View>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    textAlign: "center",
  },
});

export default SplashScreen;
