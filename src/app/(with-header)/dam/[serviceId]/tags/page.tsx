import { colors } from '@/app/_styles/colors';
import Button from '@/components/universals/forms/Button';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { TAG_CREATE_FORM } from '@/services/dam/dam.forms';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function DamTagsPage() {
  const tags = await fileServerApiService.listTags();

  return (
    <DefaultPage>
      <Section name="Tags">
        {tags.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Erstellt</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id}>
                  <td>
                    <code>{tag.key}</code>
                  </td>
                  <td>
                    {new Date(tag.creationTime).toLocaleDateString('de-DE')}
                  </td>
                  <td>
                    <form
                      action={async () => {
                        'use server';
                        await fileServerApiService.deleteTag(tag.id);
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
          <p>Keine Tags vorhanden.</p>
        )}
      </Section>

      <Section name="Neuer Tag">
        <GeneratedForm definition={TAG_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
