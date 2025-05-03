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
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { login, getCurrentUser } from "@/store/slices/authSlice";
import { fetchCart } from "@/store/slices/cartSlice";
import { fetchNotifications } from "@/store/slices/notificationSlice";
import WebSocketService from "@/services/web.socket.service";
import { router } from "expo-router";

const LoginScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const handleLogin = async () => {
    setIsLoading(true);
    if (!email.trim() || !password.trim()) {
      setToast({
        message: "Vui lòng điền đầy đủ thông tin",
        type: "error",
        visible: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Gọi action login
      const loginResult = await dispatch(login({ email, password })).unwrap();
      // Lấy thông tin người dùng
      await dispatch(getCurrentUser()).unwrap();
      // Lấy giỏ hàng
      await dispatch(fetchCart()).unwrap();
      // Lấy thông báo
      if (loginResult.userId) {
        await dispatch(
          fetchNotifications({ userId: loginResult.userId, page: 1, size: 10 })
        ).unwrap();
      }
      // Kết nối WebSocket
      if (user?.email && accessToken) {
        WebSocketService.connect(
          "ws://192.168.1.6:9990/ws", // Thay bằng URL backend của bạn
          user.email,
          accessToken,
          (notification) => {
            // Thêm thông báo mới vào Redux
            dispatch({
              type: "notifications/addNotification",
              payload: {
                ...notification,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                userId: loginResult.userId,
                isRead: false,
              },
            });
          },
          () => console.log("Kết nối WebSocket thành công"),
          (err) => {
            console.error("Lỗi WebSocket:", err);
            setToast({
              message: "Không thể kết nối WebSocket",
              type: "error",
              visible: true,
            });
          }
        );
      } else {
        setToast({
          message: "Không tìm thấy email hoặc token để kết nối WebSocket",
          type: "error",
          visible: true,
        });
      }

      setToast({
        message: "Đăng nhập thành công!",
        type: "success",
        visible: true,
      });
      setTimeout(() => {
        router.replace("/(tabs)/home");
        setIsLoading(false);
      }, 2000);
    } catch (err: any) {
      setToast({
        message: `Đăng nhập thất bại: ${err || "Lỗi không xác định"}`,
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
        Đăng Nhập
      </TextComponent>
      <TextComponent type="body" style={styles.description}>
        Đăng nhập để tích điểm và đổi những ưu đãi dành riêng cho thành viên bạn
        nhé!
      </TextComponent>

      <SpaceComponent size={24} />

      {/* Form */}
      <View style={styles.formBox}>
        {/* Email Input */}
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
          />
        </View>

        <SpaceComponent size={16} />

        {/* Password Input */}
        <View>
          <TextComponent style={styles.label}>
            Mật khẩu <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <View style={styles.passwordContainer}>
            <InputComponent
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
              accessibilityLabel="Mật khẩu"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              accessibilityLabel={
                showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
              }
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color={isDarkMode ? Colors.iconActive : Colors.iconInactive}
              />
            </TouchableOpacity>
          </View>
        </View>

        <SpaceComponent size={24} />

        {/* Nút Đăng Nhập */}
        <ButtonComponent
          title="Đăng Nhập"
          onPress={handleLogin}
          type="primary"
          style={styles.button}
          textStyle={styles.buttonText}
          loading={isLoading}
          disabled={isLoading}
          accessibilityLabel="Nút đăng nhập"
        />

        <SpaceComponent size={16} />

        {/* Liên kết Quên mật khẩu và Tạo tài khoản */}
        <RowComponent justifyContent="space-between" alignItems="center">
          <ButtonComponent
            type="text"
            title="Quên mật khẩu"
            style={{ paddingHorizontal: 4 }}
            textStyle={styles.link}
            onPress={() => router.push("/forgot-password")}
            accessibilityLabel="Quên mật khẩu"
          />
          <ButtonComponent
            type="text"
            title="Tạo tài khoản"
            style={{ paddingHorizontal: 4 }}
            textStyle={styles.link}
            onPress={() => router.push("/register")}
            accessibilityLabel="Tạo tài khoản"
          />
        </RowComponent>

        <SpaceComponent size={16} />

        {/* Văn bản phụ */}
        <TextComponent style={styles.termsText}>
          Chấp nhận những điều khoản và điều kiện thành viên
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
});

export default LoginScreen;
