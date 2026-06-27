import 'server-only';

import React from 'react';
import Section from "@/components/universals/section/Section";
import { FunctionDto } from '@/services/function/function.type';

type FunctionSettingsFormProps = {
  function: FunctionDto;
  serviceId: string;
};

const FunctionSettingsForm: React.FunctionComponent<FunctionSettingsFormProps> = ({ function: func, serviceId }) => {
  return (
    <>
      <Section name="Function Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <strong>Name:</strong> {func.name}
          </div>
          <div>
            <strong>External ID:</strong> {func.externalId}
          </div>
          <div>
            <strong>Debug Logging:</strong> {func.enableDebugLogging ? 'Aktiviert' : 'Deaktiviert'}
          </div>
          <div>
            <strong>Error Logging:</strong> {func.enableErrorLogging ? 'Aktiviert' : 'Deaktiviert'}
          </div>
          <div>
            <strong>Retention Time:</strong> {func.retentionTimeSeconds} Sekunden
          </div>
        </div>
      </Section>
      
      <Section name="Aktuelle Einstellungen">
        <div style={{ marginTop: '1rem' }}>
          <p><strong>ID:</strong> {func.id}</p>
          <p><strong>Erstellt:</strong> {new Date(func.creationTime).toLocaleString()}</p>
        </div>
      </Section>
    </>
  );
};

export default FunctionSettingsForm;
