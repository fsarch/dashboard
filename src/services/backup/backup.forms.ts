import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const BACKUP_JOB_CREATE_FORM: TGeneratedFormDefinition = {
  dataSources: {
    connectorServices: {
      $type: 'fetch',
      path: '/v1/connectors/services',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [$map(body.data, function($v, $i, $a) { { "id": $v.id, "value": $v.id, "label": "[" & $v.connector.name & "] " & $v.name } })] }',
      },
    },
    storages: {
      $type: 'fetch',
      path: '/v1/storages',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [$map(body.data, function($v, $i, $a) { { "id": $v.id, "value": $v.id, "label": $v.name } })] }',
      },
    },
  },
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'connectorServiceId',
    $type: 'select',
    label: 'Service',
    data: {
      $type: 'datasource',
      value: 'connectorServices',
    },
  }, {
    id: 'storageId',
    $type: 'select',
    label: 'Storage',
    data: {
      $type: 'datasource',
      value: 'storages',
    },
  }, {
    id: 'cronExpression',
    $type: 'text',
    label: 'Schedule (Cron Expression)',
  }, {
    id: 'timeoutSeconds',
    $type: 'number',
    label: 'Timeout (seconds)',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "connectorServiceId": dataSource.connectorServices[0].id, "storageId": dataSource.storages[0].id, "cronExpression": "0 0 * * *", "timeoutSeconds": 3600 }'
  },
  endpoint: {
    path: '/v1/backup-jobs',
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
      value: "service.localPath & '/job/' & response.body.id",
    },
  }],
  buttons: {
    submitButtonText: 'Create Backup Job',
  },
};


export const BACKUP_CREATE_FORM: TGeneratedFormDefinition = {
  dataSources: {
    connectorServices: {
      $type: 'fetch',
      path: '/v1/connectors/services',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [$map(body.data, function($v, $i, $a) { { "id": $v.id, "value": $v.id, "label": "[" & $v.connector.name & "] " & $v.name } })] }',
      },
    },
    storages: {
      $type: 'fetch',
      path: '/v1/storages',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [$map(body.data, function($v, $i, $a) { { "id": $v.id, "value": $v.id, "label": $v.name } })] }',
      },
    },
  },
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'connectorServiceId',
    $type: 'select',
    label: 'Service',
    data: {
      $type: 'datasource',
      value: 'connectorServices',
    },
  }, {
    id: 'storageId',
    $type: 'select',
    label: 'Storage',
    data: {
      $type: 'datasource',
      value: 'storages',
    },
  }, {
    id: 'timeoutSeconds',
    $type: 'number',
    label: 'Timeout (seconds)',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "connectorServiceId": dataSource.connectorServices[0].id, "storageId": dataSource.storages[0].id, "timeoutSeconds": 3600 }'
  },
  endpoint: {
    path: '/v1/backups',
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
      value: "service.localPath & '/backup/' & response.body.id",
    },
  }],
  buttons: {
    submitButtonText: 'Create Backup',
  },
};

