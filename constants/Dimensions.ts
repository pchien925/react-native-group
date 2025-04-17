import { Dimensions } from "react-native";

// Lấy kích thước màn hình
const { width, height } = Dimensions.get("window");

export const ScreenDimensions = {
  WIDTH: width,
  HEIGHT: height,
};
