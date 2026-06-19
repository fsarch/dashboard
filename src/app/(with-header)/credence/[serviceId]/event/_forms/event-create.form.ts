import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const EVENT_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'eventTypeId',
      $type: 'select',
      label: 'Event Type',
      data: {
        $type: 'datasource',
        value: 'eventTypes',
      },
    },
    {
      id: 'scopes',
      $type: 'nested-form',
      label: 'Scopes',
      isArray: true,
      addInitialValues: {
        type: 'ip',
        value: '',
      },
      inputs: [
        {
          id: 'type',
          $type: 'select',
          label: 'Type',
          data: {
            $type: 'constant',
            value: [
              { id: 'ip', value: 'ip', label: 'IP' },
              { id: 'asn', value: 'asn', label: 'ASN' },
              { id: 'subnet', value: 'subnet', label: 'Subnet' },
              { id: 'browserFingerprint', value: 'browserFingerprint', label: 'Browser Fingerprint' },
              { id: 'customFingerprint', value: 'customFingerprint', label: 'Custom Fingerprint' },
            ],
          },
        },
        {
          id: 'value',
          $type: 'text',
          label: 'Value',
        },
      ],
    },
    {
      id: 'externalId',
      $type: 'text',
      label: 'Externe ID (optional)',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "eventTypeId": "", "scopes": [], "externalId": "" }',
  },
  endpoint: {
    path: '/v1/events',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: `{
        "eventTypeId": form.eventTypeId,
        "scopes": form.scopes ~> | $ | { "type": type, "value": value } |,
        "externalId": form.externalId != "" ? form.externalId : null
      }`,
    },
  },
  dataSources: {
    eventTypes: {
      $type: 'fetch',
      path: '/v1/event-types?page=1&pageSize=100',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [body.data.{"id": id, "value": id, "label": name & " (Score: " & defaultScoreFactor & ", TTL: " & defaultTtlSeconds & "s)"}] }',
      },
    },
  },
};
