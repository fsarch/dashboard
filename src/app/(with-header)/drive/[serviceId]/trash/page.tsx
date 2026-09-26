import Button from '@/components/universals/forms/Button';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function DriveTrashPage() {
  const trash = await fileServerApiService.listTrash();

  return (
    <DefaultPage>
      <Section name="Gelöschte Ordner">
        {trash.folders.data.length > 0 ? (
          <List>
            {trash.folders.data.map((folder) => (
              <ListItem
                key={folder.id}
                right={
                  <form
                    action={async () => {
                      'use server';
                      await fileServerApiService.restoreFolder(folder.id);
                    }}
                  >
                    <Button type="submit">Wiederherstellen</Button>
                  </form>
                }
              >
                {folder.name}
              </ListItem>
            ))}
          </List>
        ) : (
          <p>Keine gelöschten Ordner.</p>
        )}
      </Section>

      <Section name="Gelöschte Dateien">
        {trash.assets.data.length > 0 ? (
          <List>
            {trash.assets.data.map((asset) => (
              <ListItem
                key={asset.id}
                right={
                  <form
                    action={async () => {
                      'use server';
                      await fileServerApiService.restoreAsset(asset.id);
                    }}
                  >
                    <Button type="submit">Wiederherstellen</Button>
                  </form>
                }
              >
                {asset.name}
              </ListItem>
            ))}
          </List>
        ) : (
          <p>Keine gelöschten Dateien.</p>
        )}
      </Section>
    </DefaultPage>
  );
}
