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

export default async function CachePolicyListPage({
  params,
}: {
  params: Promise<{ domainGroupId: string }>;
}) {
  const { domainGroupId } = await params;

  const [cachePolicies, createLink, canSeeDevResponse] = await Promise.all([
    frontierService.listCachePolicies(domainGroupId),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/cache-policy/create`),
    uacUtils.isDeveloper(),
  ]);

  return (
    <DefaultPage>
      <Section name="Cache Policies">
        <div style={{ marginBottom: '12px' }}>
          <Link href={createLink}>
            <Button type="button">+ Cache Policy erstellen</Button>
          </Link>
        </div>
        <List>
          {cachePolicies.map(async (policy) => (
            <LinkListItem
              key={policy.id}
              href={await getServiceLocalUrl(`/domain-group/${domainGroupId}/cache-policy/${policy.id}`)}
            >
              {policy.name}
            </LinkListItem>
          ))}
        </List>
      </Section>
      {canSeeDevResponse ? (
        <DevResponseSection title="Cache Policies" response={cachePolicies} />
      ) : null}
    </DefaultPage>
  );
}

