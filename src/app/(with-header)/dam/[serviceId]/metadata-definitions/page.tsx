import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Section from '@/components/universals/section/Section';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import Button from '@/components/universals/forms/Button';
import { colors } from '@/app/_styles/colors';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { METADATA_DEFINITION_CREATE_FORM } from '@/services/dam/dam.forms';

export const generateMetadata = createAutomaticMetadata();

export default async function DamMetadataDefinitionsPage() {
  const definitions = await fileServerApiService.listMetadataDefinitions();

  return (
    <DefaultPage>
      <Section name="Metadaten-Definitionen">
        {definitions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Datentyp</th>
                <th>Gilt für</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {definitions.map((definition) => (
                <tr key={definition.id}>
                  <td>
                    <code>{definition.key}</code>
                  </td>
                  <td>{definition.dataType}</td>
                  <td>{definition.appliesToType ?? 'Alle'}</td>
                  <td>
                    <form
                      action={async () => {
                        'use server';
                        await fileServerApiService.deleteMetadataDefinition(definition.id);
                      }}
                    >
                      <Button type="submit" color={colors.error}>
                        Löschen
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Keine Metadaten-Definitionen vorhanden.</p>
        )}
      </Section>

      <Section name="Neue Metadaten-Definition">
        <GeneratedForm definition={METADATA_DEFINITION_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
