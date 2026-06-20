'use client';

import React from 'react';
import { TServiceConfiguration } from '@/utils/configuration.type';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type BotProtectionServiceClientProps = {
  service: TServiceConfiguration;
};

const BotProtectionServiceClient: React.FunctionComponent<BotProtectionServiceClientProps> = ({
  service,
}) => {
  const router = useRouter();

  // Automatically redirect to claims page
  useEffect(() => {
    router.push(`/bot-protection/${service.id}/claim`);
  }, [service.id, router]);

  return (
    <div className="service-client">
      <h2>Bot Protection Service: {service.name ?? service.id}</h2>
      <p>Weiterleitung zur Claims-Liste...</p>
    </div>
  );
};

export default BotProtectionServiceClient;
