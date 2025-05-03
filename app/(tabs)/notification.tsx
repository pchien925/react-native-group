// NotificationScreen.tsx
import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ContainerComponent from "@/components/common/ContainerComponent";
import TextComponent from "@/components/common/TextComponent";
import RowComponent from "@/components/common/RowComponent";
import TagComponent from "@/components/common/TagComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "@/store/slices/notificationSlice";
import { Ionicons } from "@expo/vector-icons";

const NotificationScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, currentPage, totalPages, status, error } = useSelector(
    (state: RootState) => state.notifications
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const pageSize = 10;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<INotification | null>(null);

  // Gọi API khi component mount và khi user thay đổi
  useEffect(() => {
    if (user?.id) {
      dispatch(
        fetchNotifications({ userId: user.id, page: 1, size: pageSize })
      );
    }
  }, [dispatch, user]);

  // Hàm tải thêm thông báo
  const loadMoreNotifications = () => {
    if (status !== "loading" && currentPage < totalPages && user?.id) {
      dispatch(
        fetchNotifications({
          userId: user.id,
          page: currentPage + 1,
          size: pageSize,
          isLoadMore: true,
        })
      );
    }
  };

  // Hàm mở modal và đánh dấu đã đọc
  const handleNotificationPress = (notification: INotification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
    if (!notification.isRead && user?.id) {
      dispatch(
        markNotificationAsRead({
          notificationId: notification.id,
          userId: user.id,
        })
      );
    }
  };

  // Hàm đóng modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedNotification(null);
  };

  // Render mỗi item thông báo
  const renderNotificationItem = ({ item }: { item: INotification }) => (
    <RowComponent
      style={[
        globalStyles.card,
        {
          backgroundColor: isDarkMode
            ? Colors.surfaceDark
            : Colors.surfaceLight,
          padding: 12,
        },
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={{ flex: 1 }}>
        <RowComponent justifyContent="space-between" alignItems="center">
          <TextComponent
            type="subheading"
            style={{
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
              fontWeight: item.isRead ? "normal" : "bold",
            }}
          >
            {item.title}
          </TextComponent>
          <TagComponent
            text={item.isRead ? "Đã đọc" : "Mới"}
            type={item.isRead ? "default" : "info"}
          />
        </RowComponent>
        <SpaceComponent size={4} />
        <TextComponent
          type="body"
          style={{
            color: isDarkMode
              ? Colors.textDarkSecondary
              : Colors.textLightSecondary,
          }}
        >
          {item.content}
        </TextComponent>
        <SpaceComponent size={4} />
        <TextComponent
          type="caption"
          style={{
            color: isDarkMode
              ? Colors.textDarkSecondary
              : Colors.textLightSecondary,
          }}
        >
          {new Date(item.createdAt).toLocaleString()}
        </TextComponent>
      </View>
    </RowComponent>
  );

  // Render footer cho phân trang
  const renderFooter = () => {
    if (status === "loading" && currentPage > 1) {
      return <LoadingComponent size="small" style={{ marginVertical: 12 }} />;
    }
    if (status !== "loading" && currentPage < totalPages) {
      return (
        <ButtonComponent
          title="Tải thêm"
          onPress={loadMoreNotifications}
          type="outline"
          style={{ marginVertical: 12 }}
        />
      );
    }
    return null;
  };

  // Render modal
  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDarkMode
                ? Colors.backgroundDark
                : Colors.backgroundLight,
            },
          ]}
        >
          <RowComponent
            justifyContent="space-between"
            alignItems="center"
            style={styles.modalHeader}
          >
            <TextComponent
              type="subheading"
              style={{
                color: isDarkMode
                  ? Colors.textDarkPrimary
                  : Colors.textLightPrimary,
                fontWeight: "bold",
              }}
            >
              {selectedNotification?.title || "Chi tiết thông báo"}
            </TextComponent>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons
                name="close"
                size={24}
                color={
                  isDarkMode ? Colors.textDarkPrimary : Colors.textLightPrimary
                }
              />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent size={8} />
          <TextComponent
            type="body"
            style={{
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            }}
          >
            {selectedNotification?.content || "Không có nội dung"}
          </TextComponent>
          <SpaceComponent size={8} />
          <TextComponent
            type="caption"
            style={{
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            }}
          >
            {selectedNotification
              ? new Date(selectedNotification.createdAt).toLocaleString()
              : ""}
          </TextComponent>
          <SpaceComponent size={16} />
          <ButtonComponent
            title="Đóng"
            onPress={closeModal}
            type="primary"
            style={styles.modalButton}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <ContainerComponent>
      <View style={{ flex: 1 }}>
        {!user ? (
          <TextComponent
            type="body"
            style={{
              textAlign: "center",
              color: Colors.error,
              marginTop: 20,
            }}
          >
            Vui lòng đăng nhập để xem thông báo
          </TextComponent>
        ) : status === "loading" && notifications.length === 0 ? (
          <LoadingComponent
            loadingText="Đang tải thông báo..."
            style={{ marginTop: 20 }}
          />
        ) : error ? (
          <TextComponent
            type="body"
            style={{
              textAlign: "center",
              color: Colors.error,
              marginTop: 20,
            }}
          >
            {error}
          </TextComponent>
        ) : notifications.length === 0 ? (
          <TextComponent
            type="body"
            style={{
              textAlign: "center",
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
              marginTop: 20,
            }}
          >
            Không có thông báo nào
          </TextComponent>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <SpaceComponent size={8} />}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreNotifications}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
            initialNumToRender={10}
            windowSize={21}
          />
        )}
        {renderModal()}
      </View>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 8,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
  },
});

export default NotificationScreen;
