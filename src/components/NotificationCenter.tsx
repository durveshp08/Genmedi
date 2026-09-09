import React, { useState } from "react";
import { Bell, X, Check, Trash2, Package, Truck, CreditCard, FileText, AlertCircle, ChevronRight } from "lucide-react";
import { useNotifications } from "../contexts/NotificationContext";
import { motion, AnimatePresence } from "motion/react";

export const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return Package;
      case "delivery":
        return Truck;
      case "payment":
        return CreditCard;
      case "prescription":
        return FileText;
      case "system":
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-700";
      case "delivery":
        return "bg-emerald-100 text-emerald-700";
      case "payment":
        return "bg-purple-100 text-purple-700";
      case "prescription":
        return "bg-amber-100 text-amber-700";
      case "system":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[#eff4ff] transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-[#45464d]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#dce9ff] shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#e5eeff] flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0b1c30]">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-medium text-[#006a61] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[10px] font-medium text-[#ba1a1a] hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 mx-auto text-[#dce9ff] mb-2" />
                  <p className="text-xs text-[#76777d]">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-[#e5eeff] hover:bg-[#f8f9ff] transition-colors cursor-pointer ${
                        !notification.read ? "bg-[#eff4ff]/50" : ""
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(notification.type)} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-xs text-[#0b1c30]">{notification.title}</p>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-[#006a61] shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#45464d] mt-0.5 line-clamp-2">{notification.message}</p>
                          <p className="text-[10px] text-[#76777d] mt-1">{formatTime(notification.timestamp)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="text-[#76777d] hover:text-[#ba1a1a] transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-[#e5eeff] text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-medium text-[#006a61] hover:underline flex items-center justify-center gap-1"
                >
                  View all notifications <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
