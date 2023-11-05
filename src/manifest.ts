import { defineManifest } from '@crxjs/vite-plugin';
import { version } from '../package.json';

const manifest = defineManifest(async (env) => ({
  manifest_version: 3,
  name: `${env.mode === 'development' ? '[Dev] ' : ''}SugoiShisho`,
  description: 'SugoiShisho はページ内の情報についてなんでも答えてくれます',
  version,
  background: {
    service_worker: 'background/index.ts',
  },
  // content_scripts: [
  // {
  //   matches: ['http://*/*', 'https://*/*', 'file:///*'],
  //   js: ['content/index.tsx'],
  // },
  // ],
  // host_permissions: [
  //   '<all_urls>',
  //   'http://*/*',
  //   'https://*/*',
  // ],
  options_ui: {
    page: 'options/options.html',
    open_in_tab: true,
  },
  action: {
    default_popup: 'popup/popup.html',
    default_icon: {
      '16': 'images/icon16.png',
      '32': 'images/icon32.png',
      '48': 'images/icon48.png',
      '128': 'images/icon128.png',
    },
  },
  icons: {
    '16': 'images/icon16.png',
    '32': 'images/icon32.png',
    '48': 'images/icon48.png',
    '128': 'images/icon128.png',
  },
  permissions: ['tabs', 'activeTab', 'scripting', 'storage']
}));

export default manifest;
