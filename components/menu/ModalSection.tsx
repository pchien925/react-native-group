// @/components/menu/ModalSection.tsx
import React, { memo, useCallback } from "react";
import ItemCustomizationModal from "./ItemCustomizationModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";

interface ModalSectionProps {
  visible: boolean;
  item: IMenuItem | null;
  options: IOption[];
  optionsLoading: boolean;
  selectedOptions: { [key: number]: IOptionValue };
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<{ [key: number]: IOptionValue }>
  >;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
  setToastType: React.Dispatch<React.SetStateAction<"success" | "error">>;
  setToastVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalSection: React.FC<ModalSectionProps> = ({
  visible,
  item,
  options,
  optionsLoading,
  selectedOptions,
  setSelectedOptions,
  quantity,
  setQuantity,
  onClose,
  setToastMessage,
  setToastType,
  setToastVisible,
}) => {
  console.log("ModalSection rendered");
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();

  const handleConfirmAdd = useCallback(() => {
    if (item) {
      if (Object.keys(selectedOptions).length === 0 && options.length > 0) {
        setToastMessage("Vui lòng chọn ít nhất một tùy chọn.");
        setToastType("error");
        setToastVisible(true);
        return;
      }
      dispatch(
        addToCart({
          menuItemId: item.id,
          quantity,
          options: Object.values(selectedOptions),
        })
      ).then((action) => {
        if (addToCart.fulfilled.match(action)) {
          setToastMessage(`${item.name} đã được thêm vào giỏ hàng!`);
          setToastType("success");
        } else {
          setToastMessage(
            (action.payload as string) || "Không thể thêm vào giỏ hàng"
          );
          setToastType("error");
        }
        setToastVisible(true);
      });
      onClose();
    }
  }, [
    dispatch,
    item,
    selectedOptions,
    options,
    quantity,
    onClose,
    setToastMessage,
    setToastType,
    setToastVisible,
  ]);

  return (
    <ItemCustomizationModal
      visible={visible}
      item={item}
      options={options}
      categoryId={null}
      onClose={onClose}
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
      quantity={quantity}
      setQuantity={setQuantity}
      onConfirm={handleConfirmAdd}
      isDarkMode={isDarkMode}
      loading={optionsLoading}
    />
  );
};

export default memo(ModalSection);
