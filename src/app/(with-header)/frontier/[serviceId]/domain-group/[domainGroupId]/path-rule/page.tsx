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

export default async function PathRuleListPage({
  params,
}: {
  params: Promise<{ domainGroupId: string }>;
}) {
  const { domainGroupId } = await params;

  const [pathRules, createLink, canSeeDevResponse] = await Promise.all([
    frontierService.listPathRules(domainGroupId),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/path-rule/create`),
    uacUtils.hasPermission('dev'),
  ]);

  return (
    <DefaultPage>
      <Section name="Path Rules">
        <div style={{ marginBottom: '12px' }}>
          <Link href={createLink}>
            <Button type="button">+ Path Rule erstellen</Button>
          </Link>
        </div>
        <List>
          {pathRules.map(async (rule) => (
            <LinkListItem
              key={rule.id}
              href={await getServiceLocalUrl(`/domain-group/${domainGroupId}/path-rule/${rule.id}`)}
            >
              {rule.name} ({rule.path})
            </LinkListItem>
          ))}
        </List>
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Path Rules" response={pathRules} />
      ) : null}
    </DefaultPage>
  );
}
