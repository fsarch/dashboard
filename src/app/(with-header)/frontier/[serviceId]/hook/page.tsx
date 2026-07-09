import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import { frontierService } from '@/services/frontier/frontier.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Button from '@/components/universals/forms/Button';
import Link from 'next/link';
import { uacUtils } from '@/utils/uac.utils';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';

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
