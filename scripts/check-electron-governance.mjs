import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import {
    collectDesktopGovernanceErrors,
    createMainWindowOptions,
} from '../electron/desktopGovernance.js';

const require = createRequire(import.meta.url);
const { createElectronBridge } = require('../electron/preloadContract.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const mockIpcRenderer = {
    invoke: () => Promise.resolve(undefined),
    send: () => undefined,
    on: () => undefined,
    removeListener: () => undefined,
};

const bridgeApiKeys = Object.keys(createElectronBridge(mockIpcRenderer));
const allowlistDocumentText = fs.readFileSync(
    path.join(repoRoot, 'ELECTRON_IPC_ALLOWLIST.md'),
    'utf8'
);
const expectedSnapshot = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'electron', 'governance', 'desktop-policy.snapshot.json'),
        'utf8'
    )
);
const errors = collectDesktopGovernanceErrors({
    windowOptions: createMainWindowOptions({
        preloadPath: path.join(repoRoot, 'electron', 'preload.js'),
        appVersion: 'governance-check',
    }),
    bridgeApiKeys,
    allowlistDocumentText,
    expectedSnapshot,
});

if (errors.length > 0) {
    console.error('Desktop governance check failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log('Desktop governance check passed.');
