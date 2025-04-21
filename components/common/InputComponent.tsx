import React from "react";
import {
  TextInput,
  View,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

interface InputProps extends TextInputProps {
  error?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const InputComponent: React.FC<InputProps> = ({
  error = false,
  style,
  inputStyle,
  ...props
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        globalStyles.inputContainer,
        {
          borderColor: error
            ? Colors.error
            : isDarkMode
            ? Colors.borderDark
            : Colors.borderLight,
          backgroundColor: isDarkMode
            ? Colors.surfaceDark
            : Colors.surfaceLight,
        },
        style,
      ]}
    >
      <TextInput
        style={[
          globalStyles.input,
          {
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
          },
          inputStyle,
        ]}
        accessibilityLabel={props.placeholder || "Input field"}
        placeholderTextColor={
          isDarkMode ? Colors.textDarkSecondary : Colors.textLightSecondary
        }
        {...props}
      />
    </View>
  );
};

export default InputComponent;
