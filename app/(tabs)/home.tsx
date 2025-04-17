import React, { useState } from "react";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import CategorySection from "@/components/home/CategorySectionComponent";
import OfferSection from "@/components/home/OfferSectionComponent";
import BannerSectionComponent from "@/components/home/BannerSectionComponent";

// Dữ liệu giả lập
const banners = [
  {
    id: "1",
    image:
      "https://daylambanh.edu.vn/wp-content/uploads/2024/04/cach-lam-banh-pizza.jpg",
  },
  {
    id: "2",
    image:
      "https://daylambanh.edu.vn/wp-content/uploads/2024/04/cach-lam-banh-pizza.jpg",
  },
  {
    id: "3",
    image:
      "https://daylambanh.edu.vn/wp-content/uploads/2024/04/cach-lam-banh-pizza.jpg",
  },
];

const categories = [
  {
    id: 1,
    name: "Pizza",
    description: "Pizza với nhiều loại nhân khác nhau",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJbRRB3sUeRG1rdrc54eyzueVlh48lDyXEXg&s",
  },
  {
    id: 2,
    name: "Đồ uống",
    description: "Đồ uống giải khát, nước ngọt",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJbRRB3sUeRG1rdrc54eyzueVlh48lDyXEXg&s",
  },
  {
    id: 3,
    name: "Tráng miệng",
    description: "Các món tráng miệng ngọt ngào",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJbRRB3sUeRG1rdrc54eyzueVlh48lDyXEXg&s",
  },
  {
    id: 4,
    name: "Tráng miệng",
    description: "Các món tráng miệng ngọt ngào",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJbRRB3sUeRG1rdrc54eyzueVlh48lDyXEXg&s",
  },
  {
    id: 5,
    name: "Tráng miệng",
    description: "Các món tráng miệng ngọt ngào",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJbRRB3sUeRG1rdrc54eyzueVlh48lDyXEXg&s",
  },
];

const featuredOffers = [
  {
    id: 1,
    name: "Pizza Margherita",
    price: "150,000 VNĐ",
    description: "Pizza với sốt cà chua và phô mai mozzarella",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5tuQu8Pl9Z4sRdg-ZBVA4jaqQhL4AJMkyg&s",
  },
  {
    id: 2,
    name: "Pizza Pepperoni",
    price: "180,000 VNĐ",
    description: "Pizza với xúc xích pepperoni và phô mai mozzarella",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5tuQu8Pl9Z4sRdg-ZBVA4jaqQhL4AJMkyg&s",
  },
  {
    id: 3,
    name: "Combo Gia Đình",
    price: "350,000 VNĐ",
    description: "Combo pizza, salad và đồ uống cho gia đình",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5tuQu8Pl9Z4sRdg-ZBVA4jaqQhL4AJMkyg&s",
  },
  {
    id: 4,
    name: "Combo Gia Đình",
    price: "350,000 VNĐ",
    description: "Combo pizza, salad và đồ uống cho gia đình",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5tuQu8Pl9Z4sRdg-ZBVA4jaqQhL4AJMkyg&s",
  },
  {
    id: 5,
    name: "Combo Gia Đình",
    price: "350,000 VNĐ",
    description: "Combo pizza, salad và đồ uống cho gia đình",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5tuQu8Pl9Z4sRdg-ZBVA4jaqQhL4AJMkyg&s",
  },
];

const HomeScreen: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  return (
    <ContainerComponent scrollable>
      <SpaceComponent size={16} />
      <BannerSectionComponent banners={banners} />
      <SpaceComponent size={24} />
      <CategorySection
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryPress={(categoryId) => setSelectedCategoryId(categoryId)}
      />
      <OfferSection
        offers={featuredOffers.map((item) => ({
          id: Number(item.id),
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl,
          basePrice: Number(item.price.replace(/[^0-9]/g, "")),
        }))}
      />
    </ContainerComponent>
  );
};

export default HomeScreen;
