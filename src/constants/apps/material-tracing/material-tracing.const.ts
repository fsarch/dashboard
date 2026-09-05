import { AppDefinitionType } from "@/constants/app.type";
import {
  MATERIAL_TRACING_SHORT_CODE_SCAN_FLOATING_BUTTON_ID
} from "@/constants/apps/material-tracing/material-tracing.floating-button.const";

export const MaterialTracingAppDefinition: AppDefinitionType = {
  name: 'Material Tracing',
  basePath: '/material-tracing',
  floatingButton: {
    id: MATERIAL_TRACING_SHORT_CODE_SCAN_FLOATING_BUTTON_ID,
    icon: 'qrcode',
  },
  routes: {
    '/material-type': {
      navigations: [{
        id: 'bottom',
        position: 'sidebar-bottom',
        items: [{
          name: 'Archiv',
          path: '/material-type/archive',
          icon: 'archive',
        }],
      }],
    },
    '/part-type': {
      navigations: [{
        id: 'bottom',
        position: 'sidebar-bottom',
        items: [{
          name: 'Archiv',
          path: '/part-type/archive',
          icon: 'archive',
        }],
      }],
    },
    '/part': {
      navigations: [{
        id: 'bottom',
        position: 'sidebar-bottom',
        items: [{
          name: 'Archiv',
          path: '/part/archive',
          icon: 'archive',
        }],
      }],
    },
    '/material': {
      navigations: [{
        id: 'bottom',
        position: 'sidebar-bottom',
        items: [{
          name: 'Archiv',
          path: '/material/archive',
          icon: 'archive',
        }],
      }],
    },
  },
  navigations: [{
    id: 'main',
    position: 'sidebar',
    items: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Manufacturers',
      path: '/manufacturer',
      icon: 'industry',
    }, {
      name: 'Materials',
      path: '/material',
      icon: 'vial',
    }, {
      name: 'Material-Types',
      path: '/material-type',
      icon: {
        $type: 'layers',
        icons: [{
          $type: 'fa-icon',
          icon: 'file',
        }, {
          $type: 'fa-icon',
          icon: 'vial',
          transform: 'shrink-8 down-2',
          color: '#000000',
        }],
      }
    }, {
      name: 'Parts',
      path: '/part',
      icon: 'cube',
    }, {
      name: 'Part-Types',
      path: '/part-type',
      icon: {
        $type: 'layers',
        icons: [{
          $type: 'fa-icon',
          icon: 'file',
        }, {
          $type: 'fa-icon',
          icon: 'cube',
          transform: 'shrink-8 down-2',
          color: '#000000',
        }],
      },
    }, {
      name: 'Short-Codes',
      path: '/short-code',
      icon: 'qrcode',
    }]
  }],
};
