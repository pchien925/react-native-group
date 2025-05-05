import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import InputComponent from "@/components/common/InputComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ToastComponent from "@/components/common/ToastComponent";
import RowComponent from "@/components/common/RowComponent";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { forgotPasswordApi } from "@/services/api"; // Import API

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const handleResetPassword = async () => {
    if (!email) {
      setToast({
        message: "Vui lòng nhập email",
        type: "error",
        visible: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPasswordApi(email);
      setToast({
        message:
          "Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email.",
        type: "success",
        visible: true,
      });
      setTimeout(() => {
        router.push({
          pathname: "/(auth)/verify-email",
          params: { email, source: "forgot-password" }, // Truyền email và nguồn
        });
      }, 2000);
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Gửi yêu cầu thất bại",
        type: "error",
        visible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContainerComponent scrollable>
      <SpaceComponent size={16} />
      <TextComponent type="heading" style={styles.heading}>
        Quên Mật Khẩu
      </TextComponent>
      <TextComponent type="body" style={styles.description}>
        Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
      </TextComponent>
      <SpaceComponent size={24} />
      <View style={styles.formBox}>
        <View>
          <TextComponent style={styles.label}>
            Email <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <InputComponent
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            accessibilityLabel="Email"
            keyboardType="email-address"
          />
        </View>
        <SpaceComponent size={24} />
        <ButtonComponent
          title="Gửi Yêu Cầu"
          onPress={handleResetPassword}
          type="primary"
          style={styles.button}
          textStyle={styles.buttonText}
          loading={isLoading}
          accessibilityLabel="Nút gửi yêu cầu đặt lại mật khẩu"
        />
        <SpaceComponent size={16} />
        <RowComponent justifyContent="center" alignItems="center">
          <ButtonComponent
            type="text"
            title="Quay lại Đăng Nhập"
            style={{ paddingHorizontal: 4 }}
            textStyle={styles.link}
            onPress={() => router.replace("/(auth)/login")}
          />
        </RowComponent>
        <SpaceComponent size={16} />
        <TextComponent style={styles.termsText}>
          Bằng cách gửi yêu cầu, bạn đồng ý với điều khoản và điều kiện của
          chúng tôi
        </TextComponent>
      </View>
      <TextComponent style={styles.footerText}>
        Phiên bản tồn đọng v0.19e.
      </TextComponent>
      <TextComponent style={styles.footerText}>
        Độ nhiệt độ và thời gian cần sử dụng.
      </TextComponent>
      <ToastComponent
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast({ ...toast, visible: false })}
        duration={2000}
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textLightPrimary,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: Colors.textLightSecondary,
    textAlign: "center",
    marginTop: 8,
    marginHorizontal: 16,
  },
  formBox: {
    width: "100%",
    alignItems: "stretch",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textLightPrimary,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.backgroundLight,
  },
  button: {
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.buttonTextPrimary,
  },
  link: {
    fontSize: 14,
    color: Colors.buttonAccent,
    fontWeight: "500",
  },
  termsText: {
    fontSize: 12,
    color: Colors.textLightSecondary,
    textAlign: "center",
  },
  footerText: {
    fontSize: 10,
    color: Colors.textLightSecondary,
    textAlign: "center",
    marginTop: 8,
  },
});

export default ForgotPasswordScreen;
