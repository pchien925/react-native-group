import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import RowComponent from "./RowComponent";
import { appColors } from "../constants/appColors";
import AntDesign from "@expo/vector-icons/AntDesign";

interface IProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  containerStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle>;
  showIcon?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad"
    | "decimal-pad";
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  secureTextEntry?: boolean;
  autoFocus?: boolean;
}

const SearchComponent = (props: IProps) => {
  const {
    placeholder = "Tìm kiếm...",
    onSearch,
    containerStyles,
    inputStyles,
    showIcon = true,
    clearable = false,
    onClear,
    value,
    onChangeText,
    autoCapitalize = "none",
    keyboardType = "default",
    returnKeyType,
    secureTextEntry = false,
    autoFocus = false,
  } = props;

  const handleTextChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={[localStyles.container, containerStyles]}>
      <RowComponent styles={localStyles.searchRow}>
        {showIcon && (
          <AntDesign
            name="search1"
            size={20}
            color={appColors.gray}
            style={localStyles.searchIcon}
          />
        )}
        <TextInput
          style={[localStyles.input, inputStyles]}
          placeholder={placeholder}
          placeholderTextColor={appColors.gray}
          onChangeText={handleTextChange}
          value={value}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          autoFocus={autoFocus}
        />
        {clearable && value && value.length > 0 && (
          <AntDesign
            name="close"
            size={20}
            color={appColors.gray}
            style={localStyles.clearIcon}
            onPress={onClear}
          />
        )}
      </RowComponent>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchRow: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 44,
    color: appColors.text,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearIcon: {
    marginLeft: 10,
    padding: 4,
  },
});

export default SearchComponent;
