import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { BaseToast, BaseToastProps } from "react-native-toast-message";
import { Colors } from "@/constants/Colors";

const CustomToast = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={[styles.toast, { borderLeftColor: Colors.success }]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      renderLeadingIcon={() => (
        <View style={[styles.icon, { backgroundColor: Colors.success }]}>
          <Text style={styles.iconText}>✓</Text>
        </View>
      )}
    />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={[styles.toast, { borderLeftColor: Colors.error }]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      renderLeadingIcon={() => (
        <View style={[styles.icon, { backgroundColor: Colors.error }]}>
          <Text style={styles.iconText}>✕</Text>
        </View>
      )}
    />
  ),
};

const styles = StyleSheet.create({
  toast: {
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 6,
    width: "90%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text1: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  text2: {
    fontSize: 14,
    color: "#666",
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  iconText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomToast;
