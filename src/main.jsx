import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { installSafeStorage } from '@utils/storage';
import { App } from './App';
import '@styles/index.css';

installSafeStorage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
