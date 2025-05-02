import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import ContainerComponent from "@/components/common/ContainerComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ToastComponent from "@/components/common/ToastComponent";
import RowComponent from "@/components/common/RowComponent";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const VerifyEmailScreen: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });
  const otpRef = useRef<any>(null);

  const handleVerifyOTP = () => {
    setIsLoading(true); // Đặt trạng thái loading về false trước khi xác minh
    if (otp.length === 6) {
      // Mô phỏng kiểm tra mã OTP
      if (otp === "123456") {
        setToast({
          message: "Xác minh OTP thành công!",
          type: "success",
          visible: true,
        });
        setTimeout(() => {
          router.replace("/(auth)/reset-password");
          otpRef.current?.clear();
        }, 2000);
      } else {
        setToast({
          message: "Mã OTP không hợp lệ",
          type: "error",
          visible: true,
        });
        setIsLoading(false);
        otpRef.current?.clear();
      }
    } else {
      setToast({
        message: "Vui lòng nhập đủ 6 chữ số OTP",
        type: "error",
        visible: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <ContainerComponent scrollable>
      <SpaceComponent size={16} />

      <TextComponent type="heading" style={styles.heading}>
        Xác Minh OTP
      </TextComponent>
      <TextComponent type="body" style={styles.description}>
        Nhập mã OTP 6 chữ số đã được gửi đến email của bạn.
      </TextComponent>

      <SpaceComponent size={24} />

      {/* Form */}
      <View style={styles.formBox}>
        {/* Trường OTP */}
        <View>
          <TextComponent style={styles.label}>
            Mã OTP <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <OtpInput
            ref={otpRef}
            numberOfDigits={6}
            onTextChange={(text) => setOtp(text)}
            focusColor={Colors.buttonPrimary}
            focusStickBlinkingDuration={500}
            autoFocus
            disabled={false}
            type="numeric"
          />
        </View>

        <SpaceComponent size={24} />

        {/* Nút Xác Nhận */}
        <ButtonComponent
          title="Xác Nhận"
          onPress={handleVerifyOTP}
          type="primary"
          style={styles.button}
          textStyle={styles.buttonText}
          loading={isLoading}
          accessibilityLabel="Nút xác nhận OTP"
        />

        <SpaceComponent size={16} />

        {/* Liên kết đến Đăng Nhập */}
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

        {/* Điều khoản */}
        <TextComponent style={styles.termsText}>
          Bằng cách xác minh OTP, bạn đồng ý với điều khoản và điều kiện của
          chúng tôi
        </TextComponent>
      </View>

      {/* Chân trang */}
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  otpInput: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    width: 50,
    height: 50,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  otpInputFocused: {
    borderColor: Colors.buttonPrimary,
    borderWidth: 2,
  },
  otpText: {
    fontSize: 20,
    color: Colors.textLightPrimary,
    textAlign: "center",
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

export default VerifyEmailScreen;
