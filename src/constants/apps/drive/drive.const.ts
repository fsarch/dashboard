import type { AppDefinitionType } from '@/constants/app.type';
import {
  DRIVE_CREATE_FOLDER_FLOATING_BUTTON_ID,
  DRIVE_UPLOAD_ASSET_FLOATING_BUTTON_ID,
} from '@/constants/apps/drive/drive.floating-button.const';

// Only the folder view ('/' and '/folder/:folderId') gets the create
// buttons - trash, groups and the asset detail page have no "create" action,
// so they intentionally fall back to no floating button (no top-level
// floatingButton is set below).
const FOLDER_VIEW_FLOATING_BUTTON = [
  {
    id: DRIVE_CREATE_FOLDER_FLOATING_BUTTON_ID,
    icon: 'folder-plus' as const,
    title: 'Ordner erstellen',
  },
  {
    id: DRIVE_UPLOAD_ASSET_FLOATING_BUTTON_ID,
    icon: 'upload' as const,
    title: 'Datei hochladen',
  },
];

export const DriveAppDefinition: AppDefinitionType = {
  name: 'Drive',
  basePath: '/drive',
  supportsCustomResources: true,
  navigations: [
    {
      id: 'main',
      position: 'sidebar',
      items: [
        {
          name: 'Ordner',
          path: '/',
          icon: 'folder',
        },
        {
          name: 'Gruppen',
          path: '/groups',
          icon: 'users',
        },
      ],
    },
    {
      id: 'bottom',
      position: 'sidebar-bottom',
      items: [
        {
          name: 'Papierkorb',
          path: '/trash',
          icon: 'trash',
        },
      ],
    },
  ],
  routes: {
    '/': {
      floatingButton: FOLDER_VIEW_FLOATING_BUTTON,
    },
    '/folder/:folderId': {
      floatingButton: FOLDER_VIEW_FLOATING_BUTTON,
    },
  },
};
