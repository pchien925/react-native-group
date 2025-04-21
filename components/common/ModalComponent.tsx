import React from "react";
import {
  Modal,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import ButtonComponent from "./ButtonComponent";
import { useTheme } from "@/contexts/ThemeContext";

interface ModalProps {
  visible: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const ModalComponent: React.FC<ModalProps> = ({
  visible,
  title,
  children,
  onClose,
  style,
  titleStyle,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={globalStyles.modalOverlay}>
        <View
          style={[
            globalStyles.modalContent,
            {
              backgroundColor: isDarkMode
                ? Colors.surfaceDark
                : Colors.surfaceLight,
            },
            style,
          ]}
        >
          <ScrollView
            style={globalStyles.modalScrollView}
            contentContainerStyle={globalStyles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {title && (
              <Text
                style={[
                  globalStyles.modalTitle,
                  {
                    color: isDarkMode
                      ? Colors.textDarkPrimary
                      : Colors.textLightPrimary,
                  },
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            )}
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;
