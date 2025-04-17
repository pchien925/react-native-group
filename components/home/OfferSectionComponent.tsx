import React from "react";
import { StyleSheet, FlatList } from "react-native";
import MenuItemComponent from "@/components/MenuItem/MenuItemComponent";
import SectionTitle from "@/components/home/CategoryTitleComponent";
import SpaceComponent from "@/components/common/SpaceComponent";

interface OfferSectionProps {
  offers: IMenuItem[];
}

const OfferSection: React.FC<OfferSectionProps> = ({ offers }) => {
  const renderOffer = ({ item }: { item: IMenuItem }) => (
    <MenuItemComponent
      menuItem={item}
      onPress={() => {
        console.log(`Navigate to product detail: ${item.name}`);
      }}
      onAddToCart={() => {
        console.log(`Add to cart: ${item.name}`);
      }}
    />
  );

  return (
    <>
      <SectionTitle title="Ưu Đãi Nổi Bật" />
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
