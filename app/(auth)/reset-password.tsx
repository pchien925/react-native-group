import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ContainerComponent from "@/components/common/ContainerComponent";
import InputComponent from "@/components/common/InputComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ToastComponent from "@/components/common/ToastComponent";
import RowComponent from "@/components/common/RowComponent";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { resetPasswordApi } from "@/services/api"; // Import API

const ResetPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });
  const { verificationToken } = useLocalSearchParams<{
    verificationToken: string;
  }>();

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setToast({
        message: "Vui lòng điền đầy đủ thông tin",
        type: "error",
        visible: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      setToast({
        message: "Mật khẩu và xác nhận mật khẩu không khớp",
        type: "error",
        visible: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Cập nhật resetPasswordApi để sử dụng verificationToken thực
      const response = await resetPasswordApi(
        verificationToken,
        password,
        confirmPassword
      );
      if (response.data) {
        setToast({
          message: "Đặt lại mật khẩu thành công!",
          type: "success",
          visible: true,
        });
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 2000);
      } else {
        setToast({
          message: "Đặt lại mật khẩu thất bại",
          type: "error",
          visible: true,
        });
      }
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Đặt lại mật khẩu thất bại",
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
        Đặt Lại Mật Khẩu
      </TextComponent>
      <TextComponent type="body" style={styles.description}>
        Nhập mật khẩu mới và xác nhận để đặt lại mật khẩu của bạn.
      </TextComponent>
      <SpaceComponent size={24} />
      <View style={styles.formBox}>
        <View>
          <TextComponent style={styles.label}>
            Mật khẩu mới{" "}
            <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <View style={styles.passwordContainer}>
            <InputComponent
              placeholder="Mật khẩu mới"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
              accessibilityLabel="Mật khẩu mới"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color={showPassword ? Colors.iconActive : Colors.iconInactive}
              />
            </TouchableOpacity>
          </View>
        </View>
        <SpaceComponent size={16} />
        <View>
          <TextComponent style={styles.label}>
            Xác nhận mật khẩu mới
            <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <View style={styles.passwordContainer}>
            <InputComponent
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={[styles.input, styles.passwordInput]}
              accessibilityLabel="Xác nhận mật khẩu mới"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={24}
                color={
                  showConfirmPassword ? Colors.iconActive : Colors.iconInactive
                }
              />
            </TouchableOpacity>
          </View>
        </View>
        <SpaceComponent size={24} />
        <ButtonComponent
          title="Đặt Lại Mật Khẩu"
          onPress={handleResetPassword}
          type="primary"
          style={styles.button}
          textStyle={styles.buttonText}
          loading={isLoading}
          accessibilityLabel="Nút đặt lại mật khẩu"
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
          Bằng cách đặt lại mật khẩu, bạn đồng ý với điều khoản và điều kiện của
          chúng tôi
        </TextComponent>
      </View>
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
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 60,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -12 }],
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

export default ResetPasswordScreen;
