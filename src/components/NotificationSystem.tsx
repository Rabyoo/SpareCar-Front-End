// frontend/src/components/NotificationSystem.tsx
import { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // WebSocket للتنبيهات الفورية
    const ws = new WebSocket(`wss://${window.location.host}/notifications`);

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // إشعار المتصفح
      if (Notification.permission === "granted") {
        new Notification("AutoParts - إشعار جديد", {
          body: notification.message,
          icon: "/favicon.ico",
        });
      }
    };

    return () => ws.close();
  }, []);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative">
      <Button variant="ghost" className="relative">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1 min-w-[20px]">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown Notifications */}
      <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border z-50">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b ${!notification.read ? "bg-blue-50" : ""}`}>
            <div className="flex items-start gap-3">
              {notification.type === "success" && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {notification.type === "error" && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              {notification.type === "info" && (
                <Info className="w-5 h-5 text-blue-500" />
              )}

              <div className="flex-1">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>
              </div>

              {!notification.read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => markAsRead(notification.id)}>
                  ✓
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
