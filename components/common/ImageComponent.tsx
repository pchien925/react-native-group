import React from "react";
import { Image, ImageProps, ImageStyle } from "react-native";

interface ImageComponentProps extends ImageProps {
  style?: ImageStyle;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ style, ...props }) => {
  return <Image style={style} {...props} />;
};

export default ImageComponent;
