import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import LinkListItem from '@/components/universals/list/LinkListItem';
import ListItem from '@/components/universals/list/ListItem';
import { frontierService } from '@/services/frontier/frontier.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';
import Button from '@/components/universals/forms/Button';
import Link from 'next/link';
import { uacUtils } from '@/utils/uac.utils';
import DevResponseSection from '@/components/universals/section/DevResponseSection.component';

export const generateMetadata = createAutomaticMetadata();

export default async function DomainGroupDetailPage({
  params,
}: {
  params: Promise<{ domainGroupId: string }>;
}) {
  const { domainGroupId } = await params;

  const [domainGroup, domains, cachePolicies, pathRules, upstreamGroups, corsPolicies, logPolicies, canSeeDevResponse] = await Promise.all([
    frontierService.getDomainGroup(domainGroupId),
    frontierService.listDomains(domainGroupId),
    frontierService.listCachePolicies(domainGroupId),
    frontierService.listPathRules(domainGroupId),
    frontierService.listUpstreamGroups(domainGroupId),
    frontierService.listCorsPolicies(domainGroupId),
    frontierService.listLogPolicies(domainGroupId),
    uacUtils.isDeveloper(),
  ]);

  if (!domainGroup) {
    return (
      <DefaultPage>
        <Section name="Domain Group">
          <p>Domain Group nicht gefunden.</p>
        </Section>
      </DefaultPage>
    );
  }

  const [
    domainCreateLink,
    cachePolicyCreateLink,
    pathRuleCreateLink,
    upstreamGroupCreateLink,
    corsPolicyCreateLink,
    logPolicyCreateLink,
    requestLogListLink,
  ] = await Promise.all([
    getServiceLocalUrl(`/domain-group/${domainGroupId}/domain/create`),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/cache-policy/create`),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/path-rule/create`),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/create`),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/cors-policy/create`),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/log-policy/create`),
    getServiceLocalUrl(`/domain-group/${domainGroupId}/request-log`),
  ]);

  return (
    <DefaultPage>
      <Section name={`Domain Group: ${domainGroup.name}`}>
        <p><strong>ID:</strong> {domainGroup.id}</p>
      </Section>

      <div id="domains">
        <Section name="Domains">
          <div style={{ marginBottom: '12px' }}>
            <Link href={domainCreateLink}>
              <Button type="button">+ Domain hinzufügen</Button>
            </Link>
          </div>
          <List>
            {domains.map((domain) => (
              <ListItem key={domain.id}>
                {domain.domainName}
              </ListItem>
            ))}
          </List>
        </Section>
      </div>

      <div id="cache-policies">
        <Section name="Cache Policies">
          <div style={{ marginBottom: '12px' }}>
            <Link href={cachePolicyCreateLink}>
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
      </div>

      <div id="path-rules">
        <Section name="Path Rules">
          <div style={{ marginBottom: '12px' }}>
            <Link href={pathRuleCreateLink}>
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
      </div>

      <div id="upstream-groups">
        <Section name="Upstream Groups">
          <div style={{ marginBottom: '12px' }}>
            <Link href={upstreamGroupCreateLink}>
              <Button type="button">+ Upstream Group erstellen</Button>
            </Link>
          </div>
          <List>
            {upstreamGroups.map(async (group) => (
              <LinkListItem
                key={group.id}
                href={await getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/${group.id}`)}
              >
                {group.name}
              </LinkListItem>
            ))}
          </List>
        </Section>
      </div>

      <div id="cors-policies">
        <Section name="CORS Policies">
          <div style={{ marginBottom: '12px' }}>
            <Link href={corsPolicyCreateLink}>
              <Button type="button">+ CORS Policy erstellen</Button>
            </Link>
          </div>
          <List>
            {corsPolicies.map(async (policy) => (
              <LinkListItem
                key={policy.id}
                href={await getServiceLocalUrl(`/domain-group/${domainGroupId}/cors-policy/${policy.id}`)}
              >
                {policy.name}
              </LinkListItem>
            ))}
          </List>
        </Section>
      </div>

      <div id="log-policies">
        <Section name="Log Policies">
          <div style={{ marginBottom: '12px' }}>
            <Link href={logPolicyCreateLink}>
              <Button type="button">+ Log Policy erstellen</Button>
            </Link>
          </div>
          <List>
            {logPolicies.map(async (policy) => (
              <LinkListItem
                key={policy.id}
                href={await getServiceLocalUrl(`/domain-group/${domainGroupId}/log-policy/${policy.id}`)}
              >
                {policy.name}
              </LinkListItem>
            ))}
          </List>
        </Section>
      </div>

      <div id="request-logs">
        <Section name="Request Logs">
          <Link href={requestLogListLink}>
            <Button type="button">Request Logs ansehen</Button>
          </Link>
        </Section>
      </div>

      {canSeeDevResponse ? (
        <DevResponseSection
          title="Domain Group Detail"
          response={{ domainGroup, domains, cachePolicies, pathRules, upstreamGroups, corsPolicies, logPolicies }}
        />
      ) : null}
    </DefaultPage>
  );
}

