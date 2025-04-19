import React from "react";
import { StyleSheet } from "react-native";
import TextComponent from "@/components/common/TextComponent";
import { Colors } from "@/constants/Colors";
import RowComponent from "../common/RowComponent";
import ButtonComponent from "../common/ButtonComponent";

interface SectionTitleProps {
  title: string;
  showButton?: boolean;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

const SectionTitleComponent: React.FC<SectionTitleProps> = ({
  title,
  showButton,
  buttonTitle,
  onButtonPress,
}) => {
  return (
    <RowComponent justifyContent="space-between" alignItems="center">
      <TextComponent type="heading" style={styles.sectionTitle}>
        {title}
      </TextComponent>
      {showButton && (
        <ButtonComponent
          title={buttonTitle || ""}
          type="text"
          onPress={onButtonPress || (() => {})}
          style={styles.sectionButton}
          textStyle={styles.sectionButtonText}
        />
      )}
    </RowComponent>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textLightPrimary,
    marginHorizontal: 8,
  },
  sectionButton: {
    padding: 0,
    paddingHorizontal: 8,
  },
  sectionButtonText: {
    fontSize: 14,
    color: Colors.primary,
  },
});

export default SectionTitleComponent;
