import { colors } from '@/app/_styles/colors';
import Button from '@/components/universals/forms/Button';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { GROUP_CREATE_FORM } from '@/services/drive/drive.forms';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function DriveGroupsPage() {
  const groups = await fileServerApiService.listGroups();

  return (
    <DefaultPage>
      <Section name="Gruppen">
        {groups.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Permission-Resource-ID</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td>
                    <code>{group.permissionResourceId}</code>
                  </td>
                  <td>
                    <form
                      action={async () => {
                        'use server';
                        await fileServerApiService.deleteGroup(group.id);
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
          <p>
            Keine Gruppen vorhanden. Gruppen bilden hier die feingranulare
            Mitgliedschaft ab, die fsarch UAC über die
            &quot;file-server:group&quot;-Berechtigung (Permission-Resource-ID)
            zuweist.
          </p>
        )}
      </Section>

      <Section name="Neue Gruppe">
        <GeneratedForm definition={GROUP_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
