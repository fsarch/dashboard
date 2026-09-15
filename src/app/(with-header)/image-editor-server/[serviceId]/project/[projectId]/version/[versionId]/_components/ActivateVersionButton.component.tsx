'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';
import { activateVersion } from './ActivateVersionButton.server-action';

type ActivateVersionButtonProps = {
  projectId: string;
  versionId: string;
};

const ActivateVersionButton: React.FunctionComponent<ActivateVersionButtonProps> = ({ projectId, versionId }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await activateVersion(projectId, versionId);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }, [projectId, versionId, router]);

  return (
    <Button type="button" onClick={handleClick} disabled={isSubmitting}>
      {isSubmitting ? 'Aktiviere...' : 'Version aktivieren'}
    </Button>
  );
};

export default ActivateVersionButton;
