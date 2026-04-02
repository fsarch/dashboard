import { TGeneratedFormDefinition } from "@/components/universals/forms/generated/GeneratedForm.type";

export const EMAIL_ACCOUNT_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'name',
    $type: 'text',
    label: 'Name',
  }, {
    id: 'alias',
    $type: 'text',
    label: 'Alias',
  }, {
    id: 'meta',
    $type: 'nested-form',
    label: 'Meta',
    inputs: [{
      id: 'color',
      $type: 'color',
      label: 'Farbe',
    }],
  }, {
    id: 'options',
    $type: 'nested-form',
    label: 'Optionen',
    inputs: [{
      id: 'eMailAddress',
      $type: 'text',
      label: 'E-Mail-Adresse',
    }, {
      id: 'inbox',
      $type: 'nested-form',
      label: 'Inbox (IMAP)',
      inputs: [{
        id: 'type',
        $type: 'select',
        label: 'Typ',
        data: {
          $type: 'constant',
          value: [{ id: 'imap', value: 'imap', label: 'IMAP' }],
        },
      }, {
        id: 'host',
        $type: 'text',
        label: 'Host',
      }, {
        id: 'port',
        $type: 'number',
        label: 'Port',
      }, {
        id: 'tls',
        $type: 'checkbox',
        label: 'TLS aktiv',
      }, {
        id: 'auth',
        $type: 'nested-form',
        label: 'Auth',
        inputs: [{
          id: 'type',
          $type: 'select',
          label: 'Typ',
          data: {
            $type: 'constant',
            value: [{ id: 'basic', value: 'basic', label: 'Basic' }],
          },
        }, {
          id: 'username',
          $type: 'text',
          label: 'Benutzername',
        }, {
          id: 'password',
          $type: 'password',
          label: 'Passwort',
        }],
      }],
    }, {
      id: 'outbox',
      $type: 'nested-form',
      label: 'Outbox (SMTP)',
      inputs: [{
        id: 'type',
        $type: 'select',
        label: 'Typ',
        data: {
          $type: 'constant',
          value: [{ id: 'smtp', value: 'smtp', label: 'SMTP' }],
        },
      }, {
        id: 'host',
        $type: 'text',
        label: 'Host',
      }, {
        id: 'port',
        $type: 'number',
        label: 'Port',
      }, {
        id: 'tls',
        $type: 'checkbox',
        label: 'TLS aktiv',
      }, {
        id: 'auth',
        $type: 'nested-form',
        label: 'Auth',
        inputs: [{
          id: 'type',
          $type: 'select',
          label: 'Typ',
          data: {
            $type: 'constant',
            value: [{ id: 'basic', value: 'basic', label: 'Basic' }],
          },
        }, {
          id: 'username',
          $type: 'text',
          label: 'Benutzername',
        }, {
          id: 'password',
          $type: 'password',
          label: 'Passwort',
        }],
      }],
    }],
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{"name":"","alias":"","meta":{"color":"#32a852"},"options":{"eMailAddress":"","inbox":{"type":"imap","host":"","port":993,"tls":true,"auth":{"type":"basic","username":"","password":""}},"outbox":{"type":"smtp","host":"","port":587,"tls":true,"auth":{"type":"basic","username":"","password":""}}}}',
  },
  endpoint: {
    path: '/v1/accounts',
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
      value: "service.localPath & '/account/' & response.body.id",
    },
  }],
  buttons: {
    submitButtonText: 'Account erstellen',
  },
};

export const EMAIL_SEND_FORM: TGeneratedFormDefinition = {
  inputs: [{
    id: 'replyTo',
    $type: 'nested-form',
    label: 'Reply-To',
    inputs: [{
      id: 'email',
      $type: 'text',
      label: 'E-Mail',
    }, {
      id: 'name',
      $type: 'text',
      label: 'Name',
    }],
  }, {
    id: 'receivers',
    $type: 'nested-form',
    label: 'Empfaenger',
    isArray: true,
    addInitialValues: {
      email: '',
      name: '',
    },
    inputs: [{
      id: 'email',
      $type: 'text',
      label: 'E-Mail',
    }, {
      id: 'name',
      $type: 'text',
      label: 'Name',
    }],
  }, {
    id: 'subject',
    $type: 'text',
    label: 'Betreff',
  }, {
    id: 'content',
    $type: 'nested-form',
    label: 'Inhalt',
    inputs: [{
      id: 'text',
      $type: 'textarea',
      label: 'Text',
    }, {
      id: 'html',
      $type: 'textarea',
      label: 'HTML',
    }],
  }],
  initialValues: {
    $type: 'jsonata',
    value: '{"replyTo":{"email":"","name":""},"receivers":[{"email":"","name":""}],"subject":"","content":{"text":"","html":""}}',
  },
  endpoint: {
    path: {
      $type: 'jsonata',
      value: "'/v1/accounts/' & args.accountId & '/emails'",
    },
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: 'form',
    },
  },
  buttons: {
    submitButtonText: 'E-Mail senden',
  },
};
