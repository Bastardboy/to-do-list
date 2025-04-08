self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting();  // Asegura que el service worker se active inmediatamente.
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  return self.clients.claim();  // Toma control de los clientes.
});

// Manejo de eventos de clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();  // Cierra la notificación al hacer clic.

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();  // Enfoca la ventana si está abierta.
        }
      }
      // Si no hay ventanas abiertas, abre una nueva ventana (o usa la ruta de tarea).
      if (clients.openWindow) {
        return clients.openWindow('/');  // Ajusta esta URL a la página que desees.
      }
    })
  );
});

// Manejo de las notificaciones push
self.addEventListener('push', (event) => {
  const notificationData = event.data ? event.data.json() : {};
  const options = {
    body: notificationData.body,
    icon: '/icon.png',
    badge: '/badge.png',
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// Escucha de la activación del servicio y la revalidación del estado de la notificación.
self.addEventListener('activate', (event) => {
  console.log('[SW] Activado y esperando notificaciones push...');
  event.waitUntil(self.clients.claim());
});

// Manejo de la sincronización en segundo plano (opcional si es necesario)
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncTasks') {
    event.waitUntil(syncTasks());
  }
});

// Función opcional para sincronizar tareas en segundo plano
async function syncTasks() {
  console.log('Sincronizando tareas...');
  // Lógica de sincronización con el servidor, si es necesario.
}
