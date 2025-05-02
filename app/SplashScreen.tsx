import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import TextComponent from "@/components/common/TextComponent";
import ImageComponent from "@/components/common/ImageComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
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
          router.replace("/(tabs)/home");
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
          source={require("@/assets/images/pizza-logo.png")}
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
          Pizza Delivery App
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
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  text: {
    textAlign: "center",
  },
});

export default SplashScreen;
