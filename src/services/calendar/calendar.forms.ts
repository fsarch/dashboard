import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

// Calendars

export const CALENDAR_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'defaultTimezone',
    $type: 'text',
    label: 'Standard-Zeitzone',
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'Externe ID',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "defaultTimezone": "Europe/Berlin", "externalId": "" }',
  },
  endpoint: {
    path: '/calendars',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      // Some responses wrap the created entity in an extra { data: ... } envelope, so fall
      // back to response.body.data.id if response.body.id isn't present.
      $type: 'jsonata',
      value: "service.localPath & '/calendar/' & (response.body.id ? response.body.id : response.body.data.id)",
    },
  }],
  buttons: {
    submitButtonText: 'Kalender erstellen',
  },
};

export const CALENDAR_EDIT_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'defaultTimezone',
    $type: 'text',
    label: 'Standard-Zeitzone',
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'Externe ID',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": args.calendar.name, "defaultTimezone": args.calendar.defaultTimezone, "externalId": args.calendar.externalId }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/calendars/' & args.calendar.id",
    },
    method: 'PUT',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};

// Event Exceptions

export const EXCEPTION_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'externalId',
    $type: 'text',
    label: 'Externe ID',
  }, {
    id: 'isMoved',
    $type: 'checkbox',
    label: 'Verschoben',
  }, {
    id: 'isCancelled',
    $type: 'checkbox',
    label: 'Storniert',
  }, {
    id: 'newEventId',
    $type: 'text',
    label: 'Neue Event-ID (falls verschoben)',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "externalId": "", "isMoved": false, "isCancelled": false, "newEventId": "" }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/calendars/' & args.calendarId & '/events/' & args.eventId & '/series/' & args.seriesId & '/exceptions'",
    },
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/calendar/' & args.calendarId & '/event/' & args.eventId & '/series/' & args.seriesId",
    },
  }],
  buttons: {
    submitButtonText: 'Exception erstellen',
  },
};

export const EXCEPTION_EDIT_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'externalId',
    $type: 'text',
    label: 'Externe ID',
  }, {
    id: 'isMoved',
    $type: 'checkbox',
    label: 'Verschoben',
  }, {
    id: 'isCancelled',
    $type: 'checkbox',
    label: 'Storniert',
  }, {
    id: 'newEventId',
    $type: 'text',
    label: 'Neue Event-ID (falls verschoben)',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "externalId": args.exception.externalId, "isMoved": args.exception.isMoved, "isCancelled": args.exception.isCancelled, "newEventId": args.exception.newEventId }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/calendars/' & args.calendarId & '/events/' & args.eventId & '/series/' & args.seriesId & '/exceptions/' & args.exception.id",
    },
    method: 'PUT',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
