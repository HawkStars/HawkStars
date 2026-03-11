'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback, useRef } from 'react';

type SituationType = 'create' | 'update' | 'delete' | 'message' | 'other';

type NotificationDoc = {
  id: string;
  title: string;
  message?: string;
  situation: SituationType;
  read: boolean;
  link?: string;
  relatedCollection?: string;
  createdAt: string;
};

/**
 * Derives an icon based on the notification's related collection and situation.
 */
function getNotificationIcon(notification: NotificationDoc): string {
  const col = notification.relatedCollection || '';
  const situation = notification.situation;

  if (col === 'contributions') {
    return situation === 'create' ? '💰' : '✅';
  }
  if (col === 'pages') {
    if (notification.title.toLowerCase().includes('published')) return '📄';
    if (notification.title.toLowerCase().includes('review')) return '👁️';
    return '📝';
  }
  if (col === 'news') {
    if (notification.title.toLowerCase().includes('published')) return '📰';
    if (notification.title.toLowerCase().includes('review')) return '👁️';
    return '✏️';
  }
  if (col === 'media') return '🖼️';

  // Fallback by situation
  const situationIcons: Record<SituationType, string> = {
    create: '🆕',
    update: '📝',
    delete: '🗑️',
    message: '💬',
    other: '🔔',
  };
  return situationIcons[situation] || '🔔';
}

/**
 * Derives a left-border color based on the notification context.
 */
function getNotificationColor(notification: NotificationDoc): string {
  const col = notification.relatedCollection || '';

  if (col === 'contributions') return '#22c55e';
  if (col === 'pages') {
    if (notification.title.toLowerCase().includes('published')) return '#3b82f6';
    if (notification.title.toLowerCase().includes('review')) return '#f59e0b';
    return '#60a5fa';
  }
  if (col === 'news') {
    if (notification.title.toLowerCase().includes('published')) return '#a855f7';
    if (notification.title.toLowerCase().includes('review')) return '#f59e0b';
    return '#c084fc';
  }
  if (col === 'media') return '#f97316';
  return '#94a3b8';
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('pt-PT');
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationDoc[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications?limit=15');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silently fail
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  };

  const handleNotificationClick = (notification: NotificationDoc) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div ref={panelRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '6px',
          fontSize: '20px',
          lineHeight: 1,
          borderRadius: '6px',
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '9999px',
              fontSize: '10px',
              fontWeight: 700,
              minWidth: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            width: '380px',
            maxHeight: '480px',
            backgroundColor: 'var(--theme-elevation-0, #fff)',
            border: '1px solid var(--theme-elevation-150, #e2e8f0)',
            borderRadius: '10px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            zIndex: 10000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid var(--theme-elevation-150, #e2e8f0)',
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: '15px',
                color: 'var(--theme-elevation-1000, #1a1a2e)',
              }}
            >
              Notifications
              {unreadCount > 0 && (
                <span
                  style={{
                    marginLeft: '8px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    padding: '2px 7px',
                    fontWeight: 600,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading && notifications.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  color: 'var(--theme-elevation-500, #94a3b8)',
                  fontSize: '13px',
                }}
              >
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 20px',
                  color: 'var(--theme-elevation-500, #94a3b8)',
                }}
              >
                <span style={{ fontSize: '32px', marginBottom: '8px' }}>🔕</span>
                <span style={{ fontSize: '13px' }}>No notifications yet</span>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    width: '100%',
                    padding: '12px 16px',
                    background: notification.read
                      ? 'transparent'
                      : 'var(--theme-elevation-50, rgba(59,130,246,0.04))',
                    borderBottom: '1px solid var(--theme-elevation-100, #f1f5f9)',
                    borderLeft: '3px solid',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderLeftColor: notification.read
                      ? 'transparent'
                      : getNotificationColor(notification),
                    cursor: notification.link ? 'pointer' : 'default',
                    textAlign: 'left',
                    transition: 'background-color 0.15s',
                    fontSize: '13px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--theme-elevation-50, rgba(0,0,0,0.02))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notification.read
                      ? 'transparent'
                      : 'var(--theme-elevation-50, rgba(59,130,246,0.04))';
                  }}
                >
                  <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>
                    {getNotificationIcon(notification)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: notification.read ? 400 : 600,
                        color: 'var(--theme-elevation-1000, #1a1a2e)',
                        lineHeight: 1.4,
                        marginBottom: '3px',
                      }}
                    >
                      {notification.title}
                    </div>
                    {notification.message && (
                      <div
                        style={{
                          color: 'var(--theme-elevation-500, #64748b)',
                          fontSize: '12px',
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {notification.message}
                      </div>
                    )}
                    <div
                      style={{
                        color: 'var(--theme-elevation-400, #94a3b8)',
                        fontSize: '11px',
                        marginTop: '4px',
                      }}
                    >
                      {timeAgo(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.read && (
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        flexShrink: 0,
                        marginTop: '6px',
                      }}
                    />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              style={{
                borderTop: '1px solid var(--theme-elevation-150, #e2e8f0)',
                padding: '10px 16px',
                textAlign: 'center',
              }}
            >
              <Link
                href='/admin/collections/notifications'
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
