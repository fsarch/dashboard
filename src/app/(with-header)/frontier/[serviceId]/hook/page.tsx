import Link from 'next/link';
import Button from '@/components/universals/forms/Button';
import LinkListItem from '@/components/universals/list/LinkListItem';
import List from '@/components/universals/list/List';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';
import Section from '@/components/universals/section/Section';
import { frontierService } from '@/services/frontier/frontier.service';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { uacUtils } from '@/utils/uac.utils';

export const generateMetadata = createAutomaticMetadata();

export default async function HookListPage() {
  const [hooks, createLink, canSeeDevResponse] = await Promise.all([
    frontierService.listHooks(),
    getServiceLocalUrl('/hook/create'),
    uacUtils.isDeveloper(),
  ]);

  return (
    <DefaultPage>
      <Section name="Hooks">
        <div style={{ marginBottom: '12px' }}>
          <Link href={createLink}>
            <Button type="button">+ Hook erstellen</Button>
          </Link>
        </div>
        <List>
          {hooks.map(async (hook) => (
            <LinkListItem
              key={hook.id}
              href={await getServiceLocalUrl(`/hook/${hook.id}`)}
            >
              {hook.name}
            </LinkListItem>
          ))}
        </List>
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Hooks" response={hooks} />
      ) : null}
    </DefaultPage>
  );
}
