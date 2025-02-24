import {
  View,
  Text,
  KeyboardType,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { ReactNode, useState } from "react";
import { appColors } from "../constants/appColors";
import { globalStyles } from "../styles/globalStyles";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import RowComponent from "./RowComponent";

interface IProps {
  value: string;
  onChange: (value: string) => void;
  affix?: ReactNode;
  placeholder?: string;
  suffix?: ReactNode;
  isPassword?: boolean;
  allowClear?: boolean;
  keyboardType?: KeyboardType;
  styles?: StyleProp<ViewStyle>;
  onEnd?: () => void;
}

const InputComponent = (props: IProps) => {
  const {
    value,
    onChange,
    affix,
    placeholder,
    suffix,
    isPassword,
    allowClear,
    keyboardType,
    styles,
    onEnd,
  } = props;

  const [isShowPassword, setIsShowPassword] = useState<boolean>(
    isPassword ?? false
  );
  return (
    <RowComponent
      styles={[
        {
          borderRadius: 12,
          borderWidth: 1,
          borderColor: appColors.gray3,
          minHeight: 56,
          justifyContent: "center",
          paddingHorizontal: 12,
          width: "100%",
          backgroundColor: appColors.white,
          marginBottom: 15,
        },
        styles,
      ]}
    >
      {affix}

      <TextInput
        style={[globalStyles.input, globalStyles.text]}
        value={value}
        placeholder={placeholder ?? ""}
        onChangeText={(value) => onChange(value)}
        secureTextEntry={isShowPassword}
        keyboardType={keyboardType ?? "default"}
        autoCapitalize="none"
        onEndEditing={onEnd}
        placeholderTextColor="#747688"
      />
      {suffix ?? suffix}
      <TouchableOpacity
        onPress={() =>
          isPassword ? setIsShowPassword(!isShowPassword) : onChange("")
        }
      >
        {isPassword ? (
          <FontAwesome
            name={isShowPassword ? "eye" : "eye-slash"}
            size={22}
            color={appColors.gray}
          />
        ) : (
          value.length > 0 &&
          allowClear && (
            <AntDesign name="close" size={22} color={appColors.gray} />
          )
        )}
      </TouchableOpacity>
    </RowComponent>
  );
};

export default InputComponent;
