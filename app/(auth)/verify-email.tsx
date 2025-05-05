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
import { router, useLocalSearchParams } from "expo-router";
import { verifyOtpApi, verifyEmailApi } from "@/services/api"; // Import APIs

const VerifyEmailScreen: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });
  const otpRef = useRef<any>(null);
  const { email, source } = useLocalSearchParams<{
    email: string;
    source?: string;
  }>(); // Lấy email và source

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setToast({
        message: "Vui lòng nhập đủ 6 chữ số OTP",
        type: "error",
        visible: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (source === "forgot-password") {
        const response = await verifyOtpApi(email || "", otp);
        setToast({
          message: "Xác minh OTP thành công!",
          type: "success",
          visible: true,
        });
        setTimeout(() => {
          otpRef.current?.clear();
          router.push({
            pathname: "/(auth)/reset-password",
            params: {
              email,
              verificationToken: response.data?.verificationToken,
            },
          });
        }, 2000);
      } else {
        await verifyEmailApi(email || "", otp);
        setToast({
          message: "Xác minh OTP thành công!",
          type: "success",
          visible: true,
        });
        setTimeout(() => {
          otpRef.current?.clear();
          router.replace("/(auth)/login");
        }, 2000);
      }
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Mã OTP không hợp lệ",
        type: "error",
        visible: true,
      });
      otpRef.current?.clear();
    } finally {
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
      <View style={styles.formBox}>
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
          Bằng cách xác minh OTP, bạn đồng ý với điều khoản và điều kiện của
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
