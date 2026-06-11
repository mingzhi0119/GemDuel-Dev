import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AssetLoadingGate } from './app/runtime/AssetLoadingGate';

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <AssetLoadingGate>
                <App />
            </AssetLoadingGate>
        </StrictMode>
    );
}
