// Nook service worker.
const CACHE_NAME = 'nook-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.postMessage({ type: 'navigate', url: targetUrl });
          return;
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: 'Nook', body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Nook', {
      body: data.body || 'A small pause is ready.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'nook-pause',
      data: { url: data.url || '/#/today' },
      requireInteraction: false,
      silent: false,
    })
  );
});
