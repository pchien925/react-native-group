// @/components/menu/ToastSection.tsx
import React, { memo } from "react";
import ToastComponent from "@/components/common/ToastComponent";

interface ToastSectionProps {
  visible: boolean;
  message: string;
  type: "success" | "error";
  onHide: () => void;
}

const ToastSection: React.FC<ToastSectionProps> = ({
  visible,
  message,
  type,
  onHide,
}) => {
  console.log("ToastSection rendered");
  return (
    <ToastComponent
      message={message}
      type={type}
      visible={visible}
      onHide={onHide}
      duration={1200}
    />
  );
};

export default memo(ToastSection);
