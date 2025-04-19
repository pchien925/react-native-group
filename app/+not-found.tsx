import React from "react";
import ContainerComponent from "@/components/common/ContainerComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

// Component trang không tìm thấy
const NotFoundScreen = () => {
  const { isDarkMode } = useTheme();

  const handleGoBack = () => {
    router.replace("/home");
  };

  return (
    <ContainerComponent>
      <TextComponent
        type="heading"
        style={[
          globalStyles.textHeading,
          styles.title,
          {
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
          },
        ]}
      >
        Không tìm thấy trang
      </TextComponent>
      <TextComponent
        type="body"
        style={[
          globalStyles.textBody,
          styles.message,
          {
            color: isDarkMode
              ? Colors.textDarkSecondary
              : Colors.textLightSecondary,
          },
        ]}
      >
        Trang bạn đang tìm kiếm không tồn tại.
      </TextComponent>
      <ButtonComponent
        title="Quay về trang chính"
        onPress={handleGoBack}
        type="primary"
        accessibilityLabel="Nút quay về trang chính"
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
  },
});

export default NotFoundScreen;
