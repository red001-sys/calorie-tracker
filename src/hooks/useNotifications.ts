import { useState, useEffect, useCallback } from "react";

interface Notification {
  id: string;
  message: string;
  type: "success" | "warning" | "info" | "levelup";
  timestamp: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("notifications");
      if (saved) {
        const parsed: Notification[] = JSON.parse(saved);
        // Keep only last 24h
        const cutoff = Date.now() - 86400000;
        const recent = parsed.filter((n) => n.timestamp > cutoff);
        setNotifications(recent);
        localStorage.setItem("notifications", JSON.stringify(recent));
      }
    } catch {
      // ignore
    }
  }, []);

  const addNotification = useCallback(
    (message: string, type: Notification["type"] = "info") => {
      const n: Notification = {
        id: crypto.randomUUID(),
        message,
        type,
        timestamp: Date.now(),
      };
      setNotifications((prev) => {
        const updated = [n, ...prev].slice(0, 20);
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem("notifications");
  }, []);

  return { notifications, addNotification, dismissNotification, clearAll };
}
