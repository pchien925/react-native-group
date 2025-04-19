const user1: IUserInfo = {
  id: 1,
  fullName: "Nguyễn Văn An",
  email: "an.nguyen@example.com",
  phone: "0909123456",
};

const user2: IUserInfo = {
  id: 2,
  fullName: "Trần Thị Bình",
  email: "binh.tran@example.com",
  phone: "0918234567",
};

// Sample orders
export const sampleOrders: IOrderSummary[] = [
  {
    id: 1,
    userInfo: user1,
    orderCode: "ORD001",
    orderStatus: "Đang xử lý",
    totalPrice: 515000, // Giá trị mẫu
    branchName: "Chi nhánh Quận 1",
    createdAt: "2025-04-18 14:30",
    updatedAt: "2025-04-18 14:35",
  },
  {
    id: 2,
    userInfo: user2,
    orderCode: "ORD002",
    orderStatus: "Đã giao",
    totalPrice: 490000, // Giá trị mẫu
    branchName: "Chi nhánh Quận 7",
    createdAt: "2025-04-17 12:15",
    updatedAt: "2025-04-17 13:00",
  },
  {
    id: 3,
    userInfo: user1,
    orderCode: "ORD003",
    orderStatus: "Đã hủy",
    totalPrice: 135000, // Giá trị mẫu
    branchName: "Chi nhánh Quận 3",
    createdAt: "2025-04-16 09:00",
    updatedAt: "2025-04-16 09:30",
  },
];
