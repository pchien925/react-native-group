import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { router } from "expo-router";
import MenuItemComponent from "@/components/MenuItem/MenuItemComponent";
import SectionTitle from "@/components/home/SectionTitleComponent";
import SpaceComponent from "@/components/common/SpaceComponent";

interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

interface OfferSectionProps {
  offers: IMenuItem[];
  onAddToCart?: (item: IMenuItem) => void;
}

const OfferSection: React.FC<OfferSectionProps> = ({ offers, onAddToCart }) => {
  const renderOffer = ({ item }: { item: IMenuItem }) => (
    <MenuItemComponent
      menuItem={item}
      onPress={() => router.push(`/menu-item/${item.id}`)}
      onAddToCart={() => onAddToCart?.(item)}
    />
  );

  return (
    <>
      <SectionTitle
        title="Ưu Đãi Nổi Bật"
        showButton
        buttonTitle="Xem tất cả"
        onButtonPress={() => {
          console.log("Navigate to all offers");
        }}
      />
      <FlatList
        data={offers}
        renderItem={renderOffer}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.offerList}
      />
      <SpaceComponent size={24} />
    </>
  );
};

const styles = StyleSheet.create({
  offerList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default OfferSection;
