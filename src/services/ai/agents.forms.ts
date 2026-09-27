import type { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

// Both provider_id and model_id are sourced from GET /v1/providers ({ id, models: [{ id, name }] }[]).
// The form system's select dataSources are static per-load (not reactive to other fields), so a
// true cascading provider->model select isn't possible here - instead every model across every
// provider is offered, with its owning provider named in the label so the pair can still be
// picked correctly by hand.
const PROVIDER_DATA_SOURCES: TGeneratedFormDefinition['dataSources'] = {
  providers: {
    $type: 'fetch',
    path: '/v1/providers',
    method: 'GET',
    transformResponse: {
      $type: 'jsonata',
      value: '{ "body": [body.{ "id": id, "value": id, "label": id }] }',
    },
  },
  models: {
    $type: 'fetch',
    path: '/v1/providers',
    method: 'GET',
    transformResponse: {
      $type: 'jsonata',
      value:
        '{ "body": [$reduce(body, function($acc, $p) { $append($acc, $p.models.{ "id": id, "value": id, "label": name & " (" & $p.id & ")" }) }, [])] }',
    },
  },
};

export const AGENT_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'description',
      $type: 'textarea',
      label: 'Beschreibung',
    },
    {
      id: 'system_prompt',
      $type: 'textarea',
      label: 'System-Prompt',
    },
    {
      id: 'provider_id',
      $type: 'select',
      label: 'Provider',
      data: { $type: 'datasource', value: 'providers' },
    },
    {
      id: 'model_id',
      $type: 'select',
      label: 'Modell',
      enableSearch: true,
      data: { $type: 'datasource', value: 'models' },
    },
    {
      id: 'external_id',
      $type: 'text',
      label: 'External ID',
    },
    {
      id: 'is_visible',
      $type: 'checkbox',
      label:
        'Sichtbar (z. B. in der Agenten-Auswahl beim Start einer Konversation)',
    },
  ],
  initialValues: {
    name: '',
    description: '',
    system_prompt: '',
    provider_id: '',
    model_id: '',
    external_id: '',
    is_visible: true,
  },
  endpoint: {
    path: '/v1/agents',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  dataSources: PROVIDER_DATA_SOURCES,
};

export const AGENT_UPDATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'name',
      $type: 'text',
      label: 'Name',
    },
    {
      id: 'description',
      $type: 'textarea',
      label: 'Beschreibung',
    },
    {
      id: 'system_prompt',
      $type: 'textarea',
      label: 'System-Prompt',
    },
    {
      id: 'provider_id',
      $type: 'select',
      label: 'Provider',
      data: { $type: 'datasource', value: 'providers' },
    },
    {
      id: 'model_id',
      $type: 'select',
      label: 'Modell',
      enableSearch: true,
      data: { $type: 'datasource', value: 'models' },
    },
    {
      id: 'is_visible',
      $type: 'checkbox',
      label:
        'Sichtbar (z. B. in der Agenten-Auswahl beim Start einer Konversation)',
    },
  ],
  initialValues: {
    $type: 'jsonata',
    value:
      '{ "name": args.agent.name, "description": args.agent.description, "system_prompt": args.agent.system_prompt, "provider_id": args.agent.provider_id, "model_id": args.agent.model_id, "is_visible": args.agent.is_visible }',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/agents/' & args.agent.id",
    },
    method: 'PUT',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  dataSources: PROVIDER_DATA_SOURCES,
  buttons: {
    submitButtonText: 'Aktualisieren',
  },
};
