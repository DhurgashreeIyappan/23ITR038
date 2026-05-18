import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';


const NotificationContext = createContext(null);

const containerStyle = {
  position: 'fixed',
  right: 20,
  bottom: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  zIndex: 9999,
  pointerEvents: 'none',
  fontFamily: 'Arial, sans-serif',
};

const toastBase = {
  pointerEvents: 'auto',
  color: '#fff',
  padding: '8px 12px',
  borderRadius: 6,
  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
  fontSize: 13,
  maxWidth: 320,
  wordBreak: 'break-word',
};

const typeColors = {
  info: '#3498db',
  success: '#2ecc71',
  error: '#e74c3c',
  warn: '#f39c12',
};

export const NotificationProvider = ({ children }) => {
  const [list, setList] = useState([]);
  const idRef = useMemo(() => ({ v: 0 }), []);

  const remove = useCallback((id) => {
    setList((s) => s.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message, type = 'info', duration = 3000) => {
    const id = `${Date.now()}_${++idRef.v}`;
    const toast = { id, message, type };
    setList((s) => [...s, toast]);

    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }

    return id;
  }, [idRef, remove]);

  return (
    <NotificationContext.Provider value={{ notify, remove, list }}>
      {children}
      <div style={containerStyle}>
        {list.map((t) => (
          <div
            key={t.id}
            style={{
              ...toastBase,
              background: typeColors[t.type] || typeColors.info,
              opacity: 0.98,
            }}
            role="status"
            aria-live="polite"
          >
            {t.message}
          </div>
        ))}
      </div>
      <input placeholder="Type a message" onKeyDown={(e) => {
        if (e.key === 'Enter') {
          notify(e.target.value);
          e.target.value = '';
        }
      }} />
      <button onClick={() => notify('New notification!', 'info')}>Add Notification</button>
      <button onClick={() => remove(list[0]?.id)}>Remove Notification</button>
      
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
};

export default useNotifications;