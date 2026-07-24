import { imagesAdminService } from '@/services/image/images-admin.service';
import { TagDefinitionDto } from '@/services/image/images-admin.type';
import { IMAGE_TAG_DEFINITION_CREATE_FORM } from '@/services/image/image.forms';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import Link from 'next/link';
import styles from './page.module.scss';
import Button from '@/components/universals/forms/Button';
import { colors } from "@/app/_styles/colors";

export default async function TagDefinitionsPage(props: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await props.params;

  // Tag-Definitionen laden
  const tagDefinitions = await imagesAdminService.listTagDefinitions();

  return (
    <DefaultPage>
      <Link href={`/image/${serviceId}`} className={styles.backLink}>
        ← Zurück zur Bilderliste
      </Link>

      <Section name="Tag-Definitionen">
        {tagDefinitions.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.tagDefinitionsTable}>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Description</th>
                  <th>Erstellt</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {tagDefinitions.map((def: TagDefinitionDto) => (
                  <tr key={def.id} className={styles.tableRow}>
                    <td className={styles.tableCellKey}>
                      <code>{def.key}</code>
                    </td>
                    <td className={styles.tableCellDescription}>
                      {def.description || <span className={styles.noDescription}>–</span>}
                    </td>
                    <td className={styles.tableCellDate}>
                      {formatDate(def.creationTime)}
                    </td>
                    <td className={styles.tableCellActions}>
                      <form
                        action={async () => {
                          'use server';
                          await imagesAdminService.deleteTagDefinition(def.id);
                        }}
                        className={styles.deleteForm}
                      >
                        <Button
                          type="submit"
                          color={colors.error}
                        >
                          Löschen
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.noDefinitions}>
            Keine Tag-Definitionen vorhanden.
          </p>
        )}
      </Section>

      <Section name="Neue Tag-Definition erstellen">
        <div className={styles.formContainer}>
          <GeneratedForm definition={IMAGE_TAG_DEFINITION_CREATE_FORM} />
        </div>
      </Section>

      <div className={styles.spacer} />
    </DefaultPage>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
