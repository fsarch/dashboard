import { EServiceType } from "@/utils/configuration.type";
import { MaterialTracingAppDefinition } from "@/constants/apps/material-tracing/material-tracing.const";
import { AppDefinitionType } from "@/constants/app.type";

export const APPS: Record<EServiceType, AppDefinitionType> = {
  [EServiceType.CUSTOMER_COMMUNICATION]: {
    name: 'Customer Communication',
    basePath: '/ccm',
  },
  [EServiceType.DATATABLE]: {
    name: 'Datatable',
    basePath: '/datatable',
  },
  [EServiceType.PIM]: {
    name: 'Product',
    basePath: '/product',
    navigation: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Kataloge',
      path: '/catalog',
      icon: 'book',
    }, {
      name: 'Lokalisierungen',
      path: '/localization',
      icon: 'language',
    }],
    routes: {
      '/catalog/:catalogId{/*path}': {
        navigation: [{
          name: 'Katalog-Übersicht',
          path: '/',
          icon: 'book',
        }, {
          name: 'Übersicht',
          path: {
            $type: 'jsonata',
            value: "'/catalog/' & params.catalogId",
          },
          icon: 'layer-group',
        }, {
          name: 'Items',
          path: {
            $type: 'jsonata',
            value: "'/catalog/' & params.catalogId & '/item'",
          },
          icon: 'sitemap',
        }, {
          name: 'Item-List',
          path: {
            $type: 'jsonata',
            value: "'/catalog/' & params.catalogId & '/item-list'",
          },
          icon: 'list',
        }, {
          name: 'Attributes',
          path: {
            $type: 'jsonata',
            value: "'/catalog/' & params.catalogId & '/attribute'",
          },
          icon: 'hashtag',
        }, {
          name: 'Element-Types',
          path: {
            $type: 'jsonata',
            value: "'/catalog/' & params.catalogId & '/item-type'",
          },
          icon: 'puzzle-piece',
        }],
      },
    },
  },
  [EServiceType.IMAGE]: {
    name: 'Image',
    basePath: '/image',
    navigation: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Bilder',
      path: '/',
      icon: 'images',
    }, {
      name: 'Tag-Definitionen',
      path: '/tags',
      icon: 'tags',
    }],
  },
  [EServiceType.MATERIAL_TRACING]: MaterialTracingAppDefinition,
  [EServiceType.CUSTOM_APP]: {
    name: 'CustomApp',
    basePath: '/custom-app',
  },
  [EServiceType.PDF_RENDER]: {
    name: 'PDF Render',
    basePath: '/pdf-render',
  },
  [EServiceType.FUNCTION]: {
    name: 'Functions',
    basePath: '/function',
    navigation: [{
      name: 'Funktionen',
      path: '/',
      icon: 'layer-group',
    }],
    routes: {
      '/function/:functionId{/*path}': {
        navigation: [{
          name: 'Funktionen',
          path: '/',
          icon: 'layer-group',
        }, {
          name: 'Code',
          path: {
            $type: 'jsonata',
            value: "'/function/' & params.functionId",
          },
          icon: 'code',
        }, {
          name: 'Einstellungen',
          path: {
            $type: 'jsonata',
            value: "'/function/' & params.functionId & '/settings'",
          },
          icon: 'gear',
        }, {
          name: 'Executions',
          path: {
            $type: 'jsonata',
            value: "'/function/' & params.functionId & '/executions'",
          },
          icon: 'play',
        }],
      },
    },
  },
  [EServiceType.FUNCTION_GATEWAY]: {
    name: 'Function Gateway',
    basePath: '/function-gateway',
    navigation: [{
      name: 'Funktionen',
      path: '/',
      icon: 'layer-group',
    }],
  },
  [EServiceType.PRINTER]: {
    name: 'Printer Server',
    basePath: '/printer',
  },
  [EServiceType.AI]: {
    name: 'AI',
    basePath: '/ai',
    navigation: [{
      name: 'Start',
      path: '/',
      icon: 'comment-dots',
    }, {
      name: 'Konversationen',
      path: '/conversations',
      icon: 'list',
    }],
  },
  [EServiceType.EMAIL_SERVER]: {
    name: 'Email Server',
    basePath: '/email',
    navigation: [{
      name: 'Accounts',
      path: '/',
      icon: 'layer-group',
    }],
  },
  [EServiceType.FRONTIER]: {
    name: 'Frontier',
    basePath: '/frontier',
    navigation: [{
      name: 'Domain Groups',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Hooks',
      path: '/hook',
      icon: 'code',
    }],
    routes: {
      '/domain-group/:domainGroupId{/*path}': {
        navigation: [{
          name: 'Zu den Domain Groups',
          path: '/',
          icon: 'arrow-left',
        }, {
          name: 'Übersicht',
          path: {
            $type: 'jsonata',
            value: "'/domain-group/' & params.domainGroupId",
          },
          icon: 'layer-group',
        }, {
          name: 'Domains',
          path: {
            $type: 'jsonata',
            value: "'/domain-group/' & params.domainGroupId & '/domain'",
          },
          icon: 'globe',
        }, {
          name: 'Cache Policies',
          path: {
            $type: 'jsonata',
            value: "'/domain-group/' & params.domainGroupId & '/cache-policy'",
          },
          icon: 'database',
        }, {
          name: 'Path Rules',
          path: {
            $type: 'jsonata',
            value: "'/domain-group/' & params.domainGroupId & '/path-rule'",
          },
          icon: 'route',
        }, {
          name: 'CORS Policies',
          path: {
            $type: 'jsonata',
            value: "'/domain-group/' & params.domainGroupId & '/cors-policy'",
          },
          icon: 'shield-halved',
        }, {
          name: 'Log Policies',
          path: {
            $type: 'jsonata',
            value: "'/domain-group/' & params.domainGroupId & '/log-policy'",
          },
          icon: 'file-lines',
        }, {
          name: 'Request Logs',
          path: {
            $type: 'jsonata',
            value: "'/domain-group/' & params.domainGroupId & '/request-log'",
          },
          icon: 'list-check',
        }, {
          name: 'Upstream Groups',
          path: {
            $type: 'jsonata',
            value: "'/domain-group/' & params.domainGroupId & '/upstream-group'",
          },
          icon: 'server',
        }, {
          name: 'Hooks',
          path: '/hook',
          icon: 'code',
        }],
      },
    },
  },
  [EServiceType.WATCHTOWER]: {
    name: 'Watchtower',
    basePath: '/watchtower',
    navigation: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Scope Types',
      path: '/scope-type',
      icon: 'tag',
    }, {
      name: 'Event Types',
      path: '/event-type',
      icon: 'bell',
    }, {
      name: 'Aggregation Modes',
      path: '/aggregation-mode',
      icon: 'cogs',
    }, {
      name: 'Events',
      path: '/event',
      icon: 'list',
    }, {
      name: 'IP-ASN Daten',
      path: '/ip-asn',
      icon: 'server',
    }, {
      name: 'Scopes',
      path: '/scope',
      icon: 'crosshairs',
    }],
  },
  [EServiceType.BOT_PROTECTION]: {
    name: 'Bot Protection',
    basePath: '/bot-protection',
    navigation: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Claims',
      path: '/claim',
      icon: 'shield-halved',
    }],
  },
  [EServiceType.METRIC]: {
    name: 'Metrics',
    basePath: '/metric',
    navigation: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }, {
      name: 'Metric Types',
      path: '/metric-type',
      icon: 'tag',
    }, {
      name: 'Metrics',
      path: '/metric',
      icon: 'chart-line',
    }],
    routes: {
      '/metric': {
        navigations: [{
          id: 'bottom',
          position: 'sidebar-bottom',
          items: [{
            name: 'Papierkorb',
            path: '/metric/trash',
            icon: 'trash',
          }],
        }],
      },
    },
  },
  [EServiceType.FRONTEND]: {
    name: 'Frontend',
    basePath: '/frontend',
    navigation: [{
      name: 'Übersicht',
      path: '/',
      icon: 'layer-group',
    }],
    routes: {
      '/{*path}': {
        navigation: [
          { name: 'Übersicht', path: '/', icon: 'layer-group' },
          { name: 'Projekte', path: '/project', icon: 'project-diagram' },
        ],
      },
      '/project{/*path}': {
        navigation: [
          { name: 'Zurück zur Übersicht', path: '/', icon: 'arrow-left' },
          { name: 'Projekte', path: '/project', icon: 'layer-group' },
        ],
      },
      '/project/:projectId{/*path}': {
        navigation: [
          { name: 'Zurück zu Projekten', path: '/project', icon: 'arrow-left' },
          {
            name: 'Projekt',
            path: { $type: 'jsonata', value: "'/project/' & params.projectId" },
            icon: 'folder',
          },
          {
            name: 'Versionen',
            path: { $type: 'jsonata', value: "'/project/' & params.projectId & '/version'" },
            icon: 'code-branch',
          },
        ],
      },
    },
  },
  [EServiceType.CALENDAR]: {
    name: 'Calendar',
    basePath: '/calendar',
    navigation: [{
      name: 'Kalender',
      path: '/',
      icon: 'calendar-days',
    }],
    routes: {
      '/calendar/:calendarId{/*path}': {
        navigation: [{
          name: 'Zurück zu Kalendern',
          path: '/',
          icon: 'arrow-left',
        }, {
          name: 'Events',
          path: {
            $type: 'jsonata',
            value: "'/calendar/' & params.calendarId",
          },
          icon: 'list',
        }, {
          name: 'Termine',
          path: {
            $type: 'jsonata',
            value: "'/calendar/' & params.calendarId & '/instances'",
          },
          icon: 'calendar-week',
        }, {
          name: 'Kalenderansicht',
          path: {
            $type: 'jsonata',
            value: "'/calendar/' & params.calendarId & '/month'",
          },
          icon: 'table-cells',
        }],
      },
      '/calendar/:calendarId/event/:eventId{/*path}': {
        navigation: [{
          name: 'Zurück zu Kalendern',
          path: '/',
          icon: 'arrow-left',
        }, {
          name: 'Events',
          path: {
            $type: 'jsonata',
            value: "'/calendar/' & params.calendarId",
          },
          icon: 'list',
        }, {
          name: 'Event',
          path: {
            $type: 'jsonata',
            value: "'/calendar/' & params.calendarId & '/event/' & params.eventId",
          },
          icon: 'calendar-day',
        }],
      },
    },
  },
};
