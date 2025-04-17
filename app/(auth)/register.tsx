import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ContainerComponent from "@/components/common/ContainerComponent";
import InputComponent from "@/components/common/InputComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ToastComponent from "@/components/common/ToastComponent";
import RowComponent from "@/components/common/RowComponent";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const RegisterScreen: React.FC = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  // Định dạng ngày thành yyyy/MM/dd
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  // Xử lý khi chọn ngày
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setDateOfBirth(currentDate);
  };

  const handleRegister = () => {
    if (
      fullname &&
      email &&
      phone &&
      gender &&
      dateOfBirth &&
      address &&
      password &&
      confirmPassword
    ) {
      if (password !== confirmPassword) {
        setToast({
          message: "Mật khẩu và xác nhận mật khẩu không khớp",
          type: "error",
          visible: true,
        });
      } else {
        setToast({
          message: "Đăng ký thành công!",
          type: "success",
          visible: true,
        });
        setTimeout(() => router.replace("login"), 2000);
      }
    } else {
      setToast({
        message: "Vui lòng điền đầy đủ thông tin",
        type: "error",
        visible: true,
      });
    }
  };

  return (
    <ContainerComponent scrollable>
      <SpaceComponent size={16} />

      <TextComponent type="heading" style={styles.heading}>
        Đăng Ký
      </TextComponent>
      <TextComponent type="body" style={styles.description}>
        Tạo tài khoản để tích điểm và nhận ưu đãi dành riêng cho thành viên!
      </TextComponent>

      <SpaceComponent size={24} />

      {/* Form */}
      <View style={styles.formBox}>
        {/* Họ và tên */}
        <View>
          <TextComponent style={styles.label}>
            Họ và tên <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <InputComponent
            placeholder="Họ và tên"
            value={fullname}
            onChangeText={setFullname}
            style={styles.input}
            accessibilityLabel="Họ và tên"
          />
        </View>

        <SpaceComponent size={16} />

        {/* Email */}
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

        <SpaceComponent size={16} />

        {/* Số điện thoại */}
        <View>
          <TextComponent style={styles.label}>
            Số điện thoại{" "}
            <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <InputComponent
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            accessibilityLabel="Số điện thoại"
            keyboardType="phone-pad"
          />
        </View>

        <SpaceComponent size={16} />

        {/* Giới tính */}
        <View>
          <TextComponent style={styles.label}>
            Giới tính <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
              accessibilityLabel="Chọn giới tính"
            >
              <Picker.Item label="Chọn giới tính" value="" />
              <Picker.Item label="Nam" value="MALE" />
              <Picker.Item label="Nữ" value="FEMALE" />
              <Picker.Item label="Khác" value="OTHER" />
            </Picker>
          </View>
        </View>

        <SpaceComponent size={16} />

        {/* Ngày sinh */}
        <View>
          <TextComponent style={styles.label}>
            Ngày sinh <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateInput}
            accessibilityLabel="Chọn ngày sinh"
          >
            <TextComponent
              style={[
                styles.inputText,
                {
                  color: dateOfBirth
                    ? Colors.textLightPrimary
                    : Colors.textLightSecondary,
                },
              ]}
            >
              {formatDate(dateOfBirth) || "yyyy/MM/dd"}
            </TextComponent>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onDateChange}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          )}
        </View>

        <SpaceComponent size={16} />

        {/* Địa chỉ */}
        <View>
          <TextComponent style={styles.label}>
            Địa chỉ <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <InputComponent
            placeholder="Địa chỉ"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            accessibilityLabel="Địa chỉ"
          />
        </View>

        <SpaceComponent size={16} />

        {/* Mật khẩu */}
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

        {/* Xác nhận mật khẩu */}
        <View>
          <TextComponent style={styles.label}>
            Xác nhận mật khẩu{" "}
            <TextComponent style={styles.required}>*</TextComponent>
          </TextComponent>
          <View style={styles.passwordContainer}>
            <InputComponent
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={[styles.input, styles.passwordInput]}
              accessibilityLabel="Xác nhận mật khẩu"
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

        <SpaceComponent size={36} />

        {/* Nút Đăng Ký */}
        <ButtonComponent
          title="Đăng Ký"
          onPress={handleRegister}
          type="primary"
          style={styles.button}
          textStyle={styles.buttonText}
          accessibilityLabel="Nút đăng ký"
        />

        <SpaceComponent size={12} />

        {/* Liên kết đến Đăng Nhập */}
        <RowComponent justifyContent="center" alignItems="center">
          <ButtonComponent
            type="text"
            title="Đã có tài khoản? Đăng nhập"
            textStyle={styles.link}
            onPress={() => router.replace("login")}
          />
        </RowComponent>

        <SpaceComponent size={16} />

        {/* Điều khoản */}
        <TextComponent style={styles.termsText}>
          Bằng cách đăng ký, bạn đồng ý với điều khoản và điều kiện của chúng
          tôi
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
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    overflow: "hidden",
  },
  picker: {
    color: Colors.textLightPrimary,
  },
  datePicker: {
    width: "100%",
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

export default RegisterScreen;
