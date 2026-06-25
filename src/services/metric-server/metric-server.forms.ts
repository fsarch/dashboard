import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

// Metric Type Create Form
export const METRIC_TYPE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'External ID (Optional)',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "externalId": "" }',
  },
  endpoint: {
    path: '/metric-types',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "externalId": form.externalId = "" ? null : form.externalId }',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/metric-server/' & service.id & '/metric-type/' & response.body.id",
    },
  }],
  buttons: {
    submitButtonText: 'Create Metric Type',
  },
  dataSources: {},
};

// Metric Create Form
export const METRIC_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'metricTypeId',
    $type: 'select',
    label: 'Metric Type',
    data: {
      $type: 'datasource',
      value: 'metricTypes',
    },
  }, {
    id: 'externalId',
    $type: 'text',
    label: 'External ID (Optional)',
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "metricTypeId": dataSource.metricTypes[0] ? dataSource.metricTypes[0].value : "", "externalId": "" }',
  },
  endpoint: {
    path: '/metrics',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "metricTypeId": form.metricTypeId, "externalId": form.externalId = "" ? null : form.externalId }',
    },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: "service.localPath & '/metric-server/' & service.id & '/metric/' & response.body.id",
    },
  }],
  buttons: {
    submitButtonText: 'Create Metric',
  },
  dataSources: {
    metricTypes: {
      $type: 'fetch',
      path: '/metric-types?page=1&pageSize=100',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": [body.data.{ "id": id, "value": id, "label": name }] }',
      },
    },
  },
};
