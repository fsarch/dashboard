import { AppDefinitionType } from "@/constants/app.type";

export const CalendarAppDefinition: AppDefinitionType = {
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
        name: 'Tagesansicht',
        path: {
          $type: 'jsonata',
          value: "'/calendar/' & params.calendarId & '/day'",
        },
        icon: 'calendar-day',
      }, {
        name: 'Wochenansicht',
        path: {
          $type: 'jsonata',
          value: "'/calendar/' & params.calendarId & '/week'",
        },
        icon: 'calendar-week',
      }, {
        name: 'Monatsansicht',
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
};
