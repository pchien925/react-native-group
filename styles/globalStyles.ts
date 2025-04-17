import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const globalStyles = StyleSheet.create({
  // Styles cho Button
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  // Styles cho Input
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },

  // Styles cho Card
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
  },

  // Styles cho badge
  badge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  // Styles cho Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },

  // Styles cho Container
  container: {
    flex: 1,
    padding: 8,
  },

  // Styles cho Section
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  // Styles cho Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  // Styles cho Tag
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Styles cho Space
  space: {
    height: 8,
  },

  // Styles cho Text
  textHeading: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  textSubheading: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  textBody: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  },
  textCaption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },

  // Styles cho Avatar
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },

  // Styles cho Toast
  toast: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  toastText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },

  // Styles cho ListItem
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  listItemDescription: {
    fontSize: 14,
    fontWeight: "400",
  },

  // Styles cho Progress
  progressContainer: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },

  // Styles cho Back Button
  backButton: {
    padding: 6,
    marginBottom: 8,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  backButtonIcon: {
    fontSize: 24,
  },

  // Styles cho Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  // Styles cho Menu Item
  menuItemItem: {
    width: 160,
    marginRight: 16,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textLightPrimary,
    marginTop: 8,
  },
  menuItemPrice: {
    fontSize: 14,
    color: Colors.chili,
    marginTop: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: Colors.textLightSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  addToCartButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Styles cho Menu Category
  menuCategory: {
    alignItems: "center",
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
  },
  menuCategorySelected: {
    backgroundColor: Colors.primary + "20", // Nền mờ khi được chọn
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  menuCategoryImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  menuCategoryImageSelected: {
    borderWidth: 2,
    borderColor: Colors.primary, // Viền avatar khi được chọn
  },
  menuCategoryText: {
    fontSize: 14,
    color: Colors.textLightPrimary,
    marginTop: 4,
    textAlign: "center",
  },
  menuCategoryTextSelected: {
    color: Colors.primary, // Màu chữ khi được chọn
    fontWeight: "600",
  },
});
