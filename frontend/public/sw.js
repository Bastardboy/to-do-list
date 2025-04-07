
self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting(); // Forzamos activación
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  return self.clients.claim();
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
