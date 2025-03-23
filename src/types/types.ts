import { NavigatorScreenParams } from "@react-navigation/native";

// Định nghĩa các route trong tab navigation (tabs)
export type TabParamList = {
  index: undefined; // Màn hình Home trong tabs
  profile: undefined; // Màn hình Profile trong tabs
  settings: undefined; // Màn hình Settings trong tabs
};

// Định nghĩa các route cấp cao (root stack)
export type RootStackParamList = {
  "(tabs)": NavigatorScreenParams<TabParamList>; // Nhóm tabs
  "auth/Login": undefined; // Màn hình Login
  "auth/ForgotPassword": undefined; // Màn hình ForgotPassword
  "auth/Register": undefined; // Màn hình Register
};
