import Link from 'next/link';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { COLLECTION_CREATE_FORM } from '@/services/dam/dam.forms';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function DamCollectionsPage(props: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await props.params;
  const collections = await fileServerApiService.listCollections();

  return (
    <DefaultPage>
      <Section name="Sammlungen">
        {collections.data.length > 0 ? (
          <List>
            {collections.data.map((collection) => (
              <ListItem key={collection.id}>
                <Link href={`/dam/${serviceId}/collection/${collection.id}`}>
                  {collection.name}
                </Link>
              </ListItem>
            ))}
          </List>
        ) : (
          <p>Keine Sammlungen vorhanden.</p>
        )}
      </Section>

      <Section name="Neue Sammlung">
        <GeneratedForm definition={COLLECTION_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
