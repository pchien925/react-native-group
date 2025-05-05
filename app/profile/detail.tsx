import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, StyleSheet, View, Alert } from "react-native";
import { router } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import RowComponent from "@/components/common/RowComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import InputComponent from "@/components/common/InputComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getCurrentUser } from "@/store/slices/authSlice";
import CardComponent from "@/components/common/CardComponent";
import { updateUserApi, uploadFileApi } from "@/services/api";
import ImagePickerComponent from "@/components/common/ImagePickerComponent";
import ImageComponent from "@/components/common/ImageComponent";
import Toast from "react-native-toast-message";

type IconName =
  | "mail-outline"
  | "call-outline"
  | "calendar-outline"
  | "person-outline"
  | "location-outline"
  | "star-outline"
  | "shield-checkmark-outline";

interface IUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  avatar: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  status: "ACTIVE" | "INACTIVE";
  loyaltyPointsBalance: number;
}

const ProfileDetailsScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<{
    fullName: string;
    phone: string;
    dob: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    address: string;
    avatar: string | null;
  }>({
    fullName: "",
    phone: "",
    dob: "",
    gender: "OTHER",
    address: "",
    avatar: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data and fetch user info
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "OTHER",
        address: user.address || "",
        avatar: user.avatar || null,
      });
    }
    if (!user && status === "idle") {
      dispatch(getCurrentUser());
    }
  }, [user, status, dispatch]);

  // Handle input changes
  const handleInputChange = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Handle image pick and upload
  const handleImagePick = useCallback(async (file: File) => {
    setIsSubmitting(true);
    try {
      const response = await uploadFileApi(file);
      if (response.data) {
        setFormData((prev) => ({
          ...prev,
          avatar: response.data as string,
        }));
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không nhận được URL ảnh từ máy chủ",
        });
      }
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải ảnh lên",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Handle profile save with confirmation
  const handleSaveProfile = useCallback(async () => {
    if (!user?.id) return;

    // Validate data
    if (!formData.fullName) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Tên đầy đủ là bắt buộc",
      });
      return;
    }
    if (formData.dob && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Ngày sinh phải có định dạng YYYY-MM-DD",
      });
      return;
    }
    if (
      formData.gender &&
      !["MALE", "FEMALE", "OTHER"].includes(formData.gender)
    ) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Giới tính phải là Nam, Nữ hoặc Khác",
      });
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn lưu các thay đổi?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Lưu",
          onPress: async () => {
            setIsSubmitting(true);
            try {
              const apiData: Partial<IUser> = {
                fullName: formData.fullName,
                phone: formData.phone || undefined,
                dob: formData.dob || undefined,
                gender: formData.gender,
                address: formData.address || undefined,
                avatar: formData.avatar || undefined,
              };
              const response = await updateUserApi(user.id, apiData);
              dispatch(getCurrentUser());
              Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Hồ sơ đã được cập nhật thành công",
              });
              setIsEditMode(false);
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Không thể cập nhật hồ sơ",
              });
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, [formData, user?.id, dispatch]);

  // Toggle edit mode
  const handleEditToggle = useCallback(() => {
    setIsEditMode((prev) => !prev);
    if (isEditMode && user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "OTHER",
        address: user.address || "",
        avatar: user.avatar || null,
      });
    }
  }, [isEditMode, user]);

  // Loading state
  if (status === "loading") {
    return (
      <ContainerComponent style={styles.container}>
        <LoadingComponent
          loadingText="Đang tải..."
          style={styles.loadingContainer}
        />
      </ContainerComponent>
    );
  }

  // Error or no user state
  if (status === "failed" || !user) {
    return (
      <ContainerComponent style={styles.container}>
        <CardComponent
          title="Lỗi"
          content={error || "Không thể tải dữ liệu người dùng"}
          style={[
            styles.errorCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
              borderColor: isDarkMode ? Colors.borderDark : Colors.error,
            },
          ]}
          titleStyle={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
            fontWeight: "700",
          }}
        />
        <ButtonComponent
          title="Quay lại"
          type="primary"
          onPress={() => router.back()}
          style={styles.backButton}
          textStyle={styles.backButtonText}
        />
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
        },
      ]}
      scrollable
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <CardComponent
          style={[
            styles.headerCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.basil,
              borderColor: isDarkMode ? Colors.borderDark : Colors.olive,
            },
          ]}
        >
          <RowComponent alignItems="center" style={styles.headerRow}>
            {isEditMode ? (
              <ImagePickerComponent
                imageUri={formData.avatar}
                onImagePick={handleImagePick}
                style={styles.avatarImage}
              />
            ) : formData.avatar ? (
              <ImageComponent
                source={{ uri: formData.avatar }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.backgroundDark
                      : Colors.backgroundLight,
                    borderColor: isDarkMode
                      ? Colors.borderDark
                      : Colors.borderLight,
                  },
                ]}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={64}
                  color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
                />
              </View>
            )}
            <View style={styles.headerTextContainer}>
              {isEditMode ? (
                <InputComponent
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange("fullName", text)}
                  placeholder="Nhập tên đầy đủ"
                  style={styles.input}
                />
              ) : (
                <TextComponent
                  style={[
                    styles.userName,
                    {
                      color: isDarkMode ? Colors.textDarkPrimary : Colors.white,
                    },
                  ]}
                >
                  {formData.fullName}
                </TextComponent>
              )}
              <TextComponent
                style={[
                  styles.userEmail,
                  {
                    color: isDarkMode ? Colors.textDarkSecondary : Colors.white,
                  },
                ]}
              >
                {user.email}
              </TextComponent>
            </View>
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={20} />

        {/* Personal information */}
        <CardComponent
          title="Thông tin cá nhân"
          style={[
            styles.infoCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
              borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            },
          ]}
          titleStyle={styles.sectionTitle}
        >
          {[
            {
              icon: "mail-outline" as IconName,
              label: "Email",
              value: user.email,
              editable: false,
            },
            {
              icon: "call-outline" as IconName,
              label: "Số điện thoại",
              value: formData.phone || "Chưa cung cấp",
              key: "phone",
              editable: true,
            },
            {
              icon: "calendar-outline" as IconName,
              label: "Ngày sinh",
              value: formData.dob || "Chưa cung cấp",
              key: "dob",
              editable: true,
            },
            {
              icon: "person-outline" as IconName,
              label: "Giới tính",
              value:
                formData.gender === "MALE"
                  ? "Nam"
                  : formData.gender === "FEMALE"
                  ? "Nữ"
                  : formData.gender || "Chưa cung cấp",
              key: "gender",
              editable: true,
            },
            {
              icon: "location-outline" as IconName,
              label: "Địa chỉ",
              value: formData.address || "Chưa cung cấp",
              key: "address",
              editable: true,
            },
            {
              icon: "star-outline" as IconName,
              label: "Điểm tích lũy",
              value: user.loyaltyPointsBalance?.toString() || "0",
              editable: false,
            },
            {
              icon: "shield-checkmark-outline" as IconName,
              label: "Trạng thái",
              value: user.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động",
              editable: false,
            },
          ].map((item, index) => (
            <RowComponent
              key={index}
              alignItems="center"
              style={[
                styles.infoRow,
                {
                  backgroundColor: isDarkMode
                    ? Colors.backgroundDark
                    : Colors.white,
                },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
                style={styles.infoIcon}
              />
              {isEditMode && item.editable ? (
                <InputComponent
                  value={item.value}
                  onChangeText={(text) => handleInputChange(item.key!, text)}
                  placeholder={`Nhập ${item.label.toLowerCase()}`}
                  style={styles.input}
                />
              ) : (
                <TextComponent
                  style={[
                    styles.infoText,
                    {
                      color: isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    },
                  ]}
                >
                  {item.label}:{" "}
                  <TextComponent style={styles.infoValue}>
                    {item.value}
                  </TextComponent>
                </TextComponent>
              )}
            </RowComponent>
          ))}
        </CardComponent>

        <SpaceComponent size={20} />

        {/* Action buttons */}
        <RowComponent style={styles.buttonRow}>
          <ButtonComponent
            title={
              isEditMode
                ? isSubmitting
                  ? "Đang lưu..."
                  : "Lưu"
                : "Chỉnh sửa hồ sơ"
            }
            type={isEditMode ? "primary" : "outline"}
            onPress={isEditMode ? handleSaveProfile : handleEditToggle}
            disabled={isSubmitting}
            style={[
              styles.editButton,
              {
                borderColor: isDarkMode ? Colors.primary : Colors.accent,
                backgroundColor: isEditMode
                  ? isDarkMode
                    ? Colors.primary
                    : Colors.accent
                  : "transparent",
              },
            ]}
            textStyle={[
              styles.editButtonText,
              {
                color: isEditMode
                  ? Colors.white
                  : isDarkMode
                  ? Colors.primary
                  : Colors.accent,
              },
            ]}
          />
          <ButtonComponent
            title={isEditMode ? "Hủy" : "Quay lại"}
            type="primary"
            onPress={isEditMode ? handleEditToggle : () => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: isDarkMode ? Colors.primary : Colors.accent },
            ]}
            textStyle={styles.backButtonText}
          />
        </RowComponent>

        <SpaceComponent size={30} />
      </ScrollView>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: { marginTop: 8 },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
  },
  headerTextContainer: { flex: 1 },
  userName: { fontSize: 20, fontWeight: "700" },
  userEmail: { fontSize: 14, opacity: 0.8, marginTop: 4 },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textDarkPrimary,
  },
  infoRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoIcon: { marginRight: 12 },
  infoText: { fontSize: 15, flex: 1 },
  infoValue: { fontWeight: "600" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
  },
  buttonRow: { justifyContent: "space-between" },
  editButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 2,
  },
  editButtonText: { fontSize: 16, fontWeight: "600" },
  backButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 8,
    elevation: 2,
  },
  backButtonText: { fontSize: 16, fontWeight: "700", color: Colors.white },
});

export default ProfileDetailsScreen;
