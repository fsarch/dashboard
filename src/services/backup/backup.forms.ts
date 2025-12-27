import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const BACKUP_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'connectorId',
    $type: 'select',
    label: 'Connector',
    data: {
      $type: 'datasource',
      value: '/v1/connectors/connectors',
    },
  }, {
    id: 'storageId',
    $type: 'select',
    label: 'Storage',
    data: {
      $type: 'datasource',
      value: '/v1/storages/storages',
    },
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "connectorId": "", "storageId": "" }'
  },
  endpoint: {
    path: '/v1/backup-jobs/backup-jobs',
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
    submitButtonText: 'Create Backup Job',
  },
};

