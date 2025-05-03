import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Toast from "react-native-toast-message";

export class WebSocketService {
  private static instance: WebSocketService;
  private stompClient: Client | null = null;
  private connected: boolean = false;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(
    url: string,
    email: string,
    accessToken: string,
    onMessage: (notification: INotification) => void,
    onConnect?: () => void,
    onError?: (error: any) => void
  ) {
    if (this.connected) return;

    this.stompClient = new Client({
      webSocketFactory: () => {
        // Thêm accessToken vào tham số truy vấn nếu backend yêu cầu
        const wsUrl = `${url}?access_token=${encodeURIComponent(accessToken)}`;
        return new SockJS(wsUrl);
      },
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        console.log("Kết nối WebSocket thành công");

        this.stompClient?.subscribe(
          `/user/${email}/queue/notifications`,
          (message) => {
            const notification: INotification = JSON.parse(message.body);
            // Hiển thị toast cho thông báo mới
            Toast.show({
              type: "info",
              text1: notification.title,
              text2: notification.content,
              position: "top",
              visibilityTime: 4000,
            });
            onMessage(notification);
          }
        );

        this.stompClient?.subscribe("/topic/notifications", (message) => {
          console.log("Nhận thông báo all:", message.body);
          const notification: INotification = JSON.parse(message.body);
          // Hiển thị toast cho thông báo mới
          Toast.show({
            type: "info",
            text1: notification.title,
            text2: notification.content,
            position: "top",
            visibilityTime: 4000,
          });
          onMessage(notification);
        });

        onConnect?.();
      },
      onStompError: (frame) => {
        console.error("Lỗi STOMP:", frame);
        this.connected = false;
        if (frame.headers?.message?.includes("Unauthorized")) {
          console.log("Token không hợp lệ, cần làm mới token");
          // Gợi ý: Dispatch refreshToken action ở đây
          // Ví dụ: store.dispatch(refreshToken());
        }
        onError?.(frame);
      },
      onWebSocketClose: () => {
        console.log("WebSocket đã đóng");
        this.connected = false;
      },
    });

    this.stompClient.activate();
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected = false;
      console.log("Ngắt kết nối WebSocket");
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
}

export default WebSocketService.getInstance();
