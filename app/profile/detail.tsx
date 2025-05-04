import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, StyleSheet, Alert, View } from "react-native";
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
        Alert.alert("Error", "No image URL received from server");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Handle profile save
  const handleSaveProfile = useCallback(async () => {
    if (!user?.id) return;

    // Validate data
    if (!formData.fullName) {
      Alert.alert("Error", "Full name is required");
      return;
    }
    if (formData.dob && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      Alert.alert("Error", "Date of birth must be in YYYY-MM-DD format");
      return;
    }
    if (
      formData.gender &&
      !["MALE", "FEMALE", "OTHER"].includes(formData.gender)
    ) {
      Alert.alert("Error", "Gender must be Male, Female, or Other");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiData = {
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        dob: formData.dob ? new Date(formData.dob) : undefined,
        gender: formData.gender,
        address: formData.address || undefined,
        avatar: formData.avatar || undefined,
      };
      await updateUserApi(user.id, apiData);
      dispatch(getCurrentUser());
      Alert.alert("Success", "Profile updated successfully");
      setIsEditMode(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
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
          loadingText="Loading..."
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
          title="Error"
          content={error || "Unable to load user data"}
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
          title="Back"
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
                  placeholder="Full name"
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
          title="Personal Information"
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
              label: "Phone",
              value: formData.phone || "Not provided",
              key: "phone",
              editable: true,
            },
            {
              icon: "calendar-outline" as IconName,
              label: "Date of Birth",
              value: formData.dob || "Not provided",
              key: "dob",
              editable: true,
            },
            {
              icon: "person-outline" as IconName,
              label: "Gender",
              value:
                formData.gender === "MALE"
                  ? "Male"
                  : formData.gender === "FEMALE"
                  ? "Female"
                  : formData.gender || "Not provided",
              key: "gender",
              editable: true,
            },
            {
              icon: "location-outline" as IconName,
              label: "Address",
              value: formData.address || "Not provided",
              key: "address",
              editable: true,
            },
            {
              icon: "star-outline" as IconName,
              label: "Loyalty Points",
              value: user.loyaltyPointsBalance?.toString() || "0",
              editable: false,
            },
            {
              icon: "shield-checkmark-outline" as IconName,
              label: "Status",
              value: user.status === "ACTIVE" ? "Active" : "Inactive",
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
                  placeholder={`Enter ${item.label.toLowerCase()}`}
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
                  ? "Saving..."
                  : "Save"
                : "Edit Profile"
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
            title={isEditMode ? "Cancel" : "Back"}
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
