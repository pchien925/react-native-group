import React, { useCallback, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface ImagePickerComponentProps {
  imageUri: string | null;
  onImagePick: (file: File) => void;
  style?: object;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  imageUri,
  onImagePick,
  style,
}) => {
  const [localImageUri, setLocalImageUri] = useState<string | null>(imageUri);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const uri = result.assets[0].uri;
        setLocalImageUri(uri);

        // Convert URI to File object for onImagePick
        const response = await fetch(uri);

        const blob = await response.blob();
        console.log("Response:", blob, uri);
        const file = new File([blob], `image_${Date.now()}.jpg`, {
          type: blob.type,
        });

        onImagePick(file);
      }
    } catch (error) {
      console.error("Image picking error:", error);
      // You might want to show an error message to the user here
    }
  }, [onImagePick]);

  return (
    <TouchableOpacity onPress={pickImage} style={[styles.container, style]}>
      {localImageUri ? (
        <Image
          source={{ uri: localImageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons
            name="camera-outline"
            size={32}
            color={Colors.textLightPrimary}
          />
        </View>
      )}
      <View style={styles.editIcon}>
        <Ionicons name="pencil" size={16} color={Colors.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.backgroundLight,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.white,
  },
});

export default ImagePickerComponent;
