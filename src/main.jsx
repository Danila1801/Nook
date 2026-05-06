import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './styles/tokens.css';
import App from './App.jsx';
import { registerServiceWorker } from './lib/notifications/register.js';
import { setLocale } from './lib/i18n/index.js';
import { load } from './lib/storage/index.js';

const savedPrefs = load('prefs', {});
if (savedPrefs && savedPrefs.language) {
  setLocale(savedPrefs.language);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerServiceWorker();
}
