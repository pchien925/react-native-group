export interface IBanner {
  id: string;
  image: any;
}

export const banners: IBanner[] = [
  {
    id: "1",
    image: require("@/assets/images/banners/pizza-banner-1.jpg"),
  },
  {
    id: "2",
    image: require("@/assets/images/banners/pizza-banner-2.png"),
  },
  {
    id: "3",
    image: require("@/assets/images/banners/chicken-banner.jpg"),
  },
  {
    id: "4",
    image: require("@/assets/images/banners/salad-banner.jpg"),
  },
  {
    id: "5",
    image: require("@/assets/images/banners/burger-banner.png"),
  },
  {
    id: "6",
    image: require("@/assets/images/banners/appetizer-banner.png"),
  },
  {
    id: "7",
    image: require("@/assets/images/banners/drink-banner.png"),
  },
];
