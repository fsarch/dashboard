import type { Metadata } from 'next';
import { APPS } from '@/constants/apps';
import { getCurrentServiceBaseConfiguration } from '@/utils/configuration.utils';

export function createAutomaticMetadata(): () => Promise<Metadata> {
  return async () => {
    const serviceConfiguration = await getCurrentServiceBaseConfiguration();
    const serviceTypeName = APPS[serviceConfiguration.type].name;

    const parts = [];
    parts.push(serviceTypeName);
    parts.push(serviceConfiguration.name ?? 'Unknown');

    return {
      title: parts.join(' - '),
    };
  };
}
