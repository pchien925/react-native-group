import React from "react";
import { Modal, View, Text, ViewStyle, TextStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/globalStyles";
import ButtonComponent from "./ButtonComponent";
import { useTheme } from "@/contexts/ThemeContext";

interface ModalProps {
  visible: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
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
          <ButtonComponent
            title="Close"
            onPress={onClose}
            type="outline"
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;
