import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const FUNCTION_SETTINGS_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'External ID',
  }, {
    id: 'enableDebugLogging',
    $type: 'checkbox',
    label: 'Debug Logging aktivieren',
  }, {
    id: 'enableErrorLogging',
    $type: 'checkbox',
    label: 'Error Logging aktivieren',
  }, {
    id: 'retentionTimeSeconds',
    $type: 'number',
    label: 'Retention Time (Sekunden)',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": dataSource.function.name, "externalId": dataSource.function.externalId != null ? dataSource.function.externalId : "", "enableDebugLogging": dataSource.function.enableDebugLogging, "enableErrorLogging": dataSource.function.enableErrorLogging, "retentionTimeSeconds": dataSource.function.retentionTimeSeconds }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/functions/' & args.functionId",
    },
    method: 'PATCH',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "externalId": form.externalId != "" ? form.externalId : null, "enableDebugLogging": form.enableDebugLogging, "enableErrorLogging": form.enableErrorLogging, "retentionTimeSeconds": form.retentionTimeSeconds }',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/function/' & args.functionId & '/settings'",
    },
  }],
  dataSources: {
    function: {
      $type: 'fetch',
      method: 'GET',
      path: {
        $type: 'jsonata',
        value: "'/v1/functions/' & args.functionId",
      },
    },
  },
  buttons: {
    submitButtonText: 'Speichern',
  },
};
