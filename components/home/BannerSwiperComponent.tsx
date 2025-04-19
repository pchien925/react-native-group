import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import ImageComponent from "@/components/common/ImageComponent";
import { Colors } from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Banner {
  id: string;
  image: string | number;
}

interface BannerSectionProps {
  banners: Banner[];
}

const BannerSectionComponent: React.FC<BannerSectionProps> = ({ banners }) => {
  const renderBanner = ({ item }: { item: Banner }) => (
    <ImageComponent
      source={typeof item.image === "string" ? { uri: item.image } : item.image}
      style={styles.bannerImage}
      resizeMode="cover"
    />
  );

  return (
    <Swiper
      style={styles.swiper}
      autoplay
      autoplayTimeout={3}
      showsPagination
      paginationStyle={styles.pagination}
      dotColor={Colors.textLightSecondary}
      activeDotColor={Colors.primary}
    >
      {banners.map((banner) => (
        <View key={banner.id} style={styles.bannerContainer}>
          {renderBanner({ item: banner })}
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  swiper: {
    height: 200,
  },
  bannerContainer: {
    width: SCREEN_WIDTH - 32,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    bottom: 10,
  },
});

export default BannerSectionComponent;
