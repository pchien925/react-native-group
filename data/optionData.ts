// src/data/menuData.ts
export interface IOptionValue {
  id: number;
  value: string;
  additionalPrice: number;
}

export interface IOption {
  id: number;
  name: string;
  description: string;
  IOptionValues: IOptionValue[];
}

export const defaultOptions: IOption[] = [
  {
    id: 1,
    name: "Kích thước",
    description: "Chọn kích thước khẩu phần",
    IOptionValues: [
      { id: 1, value: "Nhỏ", additionalPrice: 0 },
      { id: 2, value: "Vừa", additionalPrice: 20000 },
      { id: 3, value: "Lớn", additionalPrice: 40000 },
    ],
  },
  {
    id: 2,
    name: "Topping",
    description: "Thêm topping tùy chọn",
    IOptionValues: [
      { id: 4, value: "Phô mai", additionalPrice: 15000 },
      { id: 5, value: "Thịt xông khói", additionalPrice: 25000 },
      { id: 6, value: "Không", additionalPrice: 0 },
    ],
  },
];
