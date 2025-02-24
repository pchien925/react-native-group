import React, { ReactNode } from "react";
import RowComponent from "./RowComponent";

interface IProps {
  icon?: ReactNode;
  title: string;
  isFill?: boolean;
  color?: string;
}

const TagComponent = (props: IProps) => {
  const { icon, title, isFill, color } = props;

  return <RowComponent>{icon && icon}</RowComponent>;
};

export default TagComponent;
