import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import { frontierService } from '@/services/frontier/frontier.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Button from '@/components/universals/forms/Button';
import Link from 'next/link';

export const generateMetadata = createAutomaticMetadata();

export default async function PathRuleListPage({
  params,
}: {
  params: Promise<{ domainGroupId: string }>;
}) {
  const { domainGroupId } = await params;

  const [pathRules, createLink] = await Promise.all([
    frontierService.listPathRules(domainGroupId),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/path-rule/create`),
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
          {pathRules.map((rule) => (
            <LinkListItem key={rule.id} href="#">
              {rule.name} ({rule.path})
            </LinkListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}

