import { AppDefinitionType } from "@/constants/app.type";

export const WatchtowerAppDefinition: AppDefinitionType = {
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
};
