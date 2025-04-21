import React from "react";
import { Image, ImageProps, ImageStyle, StyleProp } from "react-native";

interface ImageComponentProps extends ImageProps {
  style?: StyleProp<ImageStyle>;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ style, ...props }) => {
  return <Image style={style} {...props} />;
};

export default ImageComponent;
