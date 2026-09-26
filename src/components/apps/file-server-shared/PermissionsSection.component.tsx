import type React from 'react';
import { colors } from '@/app/_styles/colors';
import { PERMISSION_GRANT_FORM } from '@/components/apps/file-server-shared/permission.forms';
import Badge from '@/components/universals/badge/badge.component';
import Button from '@/components/universals/forms/Button';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import Section from '@/components/universals/section/Section';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import type { TPermissionResourceType } from '@/services/file-server/file-server-api.type';

type PermissionsSectionProps = {
  resourceType: TPermissionResourceType;
  resourceId: string;
  // Path (relative to the app's service base) to redirect back to after
  // granting/revoking - normally the page this section is embedded in.
  backPath: string;
};

const SUBJECT_LABEL: Record<string, string> = {
  user: 'Nutzer',
  group: 'Gruppe',
  public: 'Öffentlich',
};

const PermissionsSection: React.FunctionComponent<
  PermissionsSectionProps
> = async ({ resourceType, resourceId, backPath }) => {
  const permissions = await fileServerApiService.listPermissions(
    resourceType,
    resourceId,
  );

  return (
    <Section name="Berechtigungen">
      {permissions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Empfänger</th>
              <th>Berechtigung</th>
              <th>Erstellt von</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission.id}>
                <td>
                  <Badge color={colors.lightBlue}>
                    {SUBJECT_LABEL[permission.subjectType]}
                  </Badge>{' '}
                  {permission.subjectId ?? '–'}
                </td>
                <td>{permission.permission}</td>
                <td>{permission.createdBy}</td>
                <td>
                  <form
                    action={async () => {
                      'use server';
                      await fileServerApiService.revokePermission(
                        resourceType,
                        resourceId,
                        permission.id,
                      );
                    }}
                  >
                    <Button type="submit" color={colors.error}>
                      Entziehen
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          Keine Berechtigungen vergeben (nur der Eigentümer und Platform-Admins
          haben Zugriff).
        </p>
      )}

      <GeneratedForm
        definition={PERMISSION_GRANT_FORM(resourceType, resourceId, backPath)}
      />
    </Section>
  );
};

export default PermissionsSection;
