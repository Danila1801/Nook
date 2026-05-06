export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch (error) {
    console.warn('Service worker registration failed', error);
    return null;
  }
}

export function setupServiceWorkerMessages(navigate) {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'navigate') {
      const url = event.data.url || '/';
      const route = url.replace(/^\/?#?\/?/, '/');
      navigate(route);
    }
  });
}
