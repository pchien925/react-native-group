import React from "react";
import { StyleSheet } from "react-native";
import TextComponent from "@/components/common/TextComponent";
import { Colors } from "@/constants/Colors";

interface SectionTitleProps {
  title: string;
}

const CategoryTitleComponent: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <TextComponent type="heading" style={styles.sectionTitle}>
      {title}
    </TextComponent>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textLightPrimary,
    marginHorizontal: 16,
  },
});

export default CategoryTitleComponent;
