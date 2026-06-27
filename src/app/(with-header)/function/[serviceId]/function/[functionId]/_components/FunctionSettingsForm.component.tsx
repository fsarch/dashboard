import 'server-only';

import React from 'react';
import Section from "@/components/universals/section/Section";
import { FunctionDto } from '@/services/function/function.type';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { FUNCTION_SETTINGS_FORM } from '../_forms/function-settings.form';

type FunctionSettingsFormProps = {
  function: FunctionDto;
  serviceId: string;
};

const FunctionSettingsForm: React.FunctionComponent<FunctionSettingsFormProps> = ({ function: func, serviceId }) => {
  // const formDefinition = {
  //   ...FUNCTION_SETTINGS_FORM,
  //   initialValues: {
  //     $type: 'jsonata' as const,
  //     value: `{ "name": "${func.name}", "externalId": "${func.externalId ?? ''}", "enableDebugLogging": ${func.enableDebugLogging}, "enableErrorLogging": ${func.enableErrorLogging}, "retentionTimeSeconds": ${func.retentionTimeSeconds} }`,
  //   },
  // };

  return (
    <>
      <Section name="Function Settings">
        <GeneratedForm
          definition={FUNCTION_SETTINGS_FORM}
          args={{
            functionId: func.id,
          }}
        />
      </Section>

      <Section name="Aktuelle Einstellungen">
        <div>
          <p><strong>ID:</strong> {func.id}</p>
          <p><strong>Erstellt:</strong> {new Date(func.creationTime).toLocaleString()}</p>
        </div>
      </Section>
    </>
  );
};

export default FunctionSettingsForm;
