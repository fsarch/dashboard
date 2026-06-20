'use client';

import React from 'react';
import { TClaimDto } from '@/services/bot-protection/bot-protection.type';
import Link from 'next/link';

type ClaimDetailProps = {
  claim: TClaimDto;
  serviceId: string;
};

const ClaimDetail: React.FunctionComponent<ClaimDetailProps> = ({
  claim,
  serviceId,
}) => {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="claim-detail">
      <div className="claim-detail__header">
        <h2>Claim Details</h2>
        <Link href={`/bot-protection/${serviceId}/claim`} className="back-link">
          ← Zurück zur Liste
        </Link>
      </div>

      <div className="claim-detail__content">
        <div className="claim-detail__field">
          <strong>ID:</strong> {claim.id}
        </div>

        {claim.externalId && (
          <div className="claim-detail__field">
            <strong>External ID:</strong> {claim.externalId}
          </div>
        )}

        <div className="claim-detail__field">
          <strong>Difficulty:</strong> {claim.difficulty}
        </div>

        {claim.duration !== null && (
          <div className="claim-detail__field">
            <strong>Duration:</strong> {claim.duration} seconds
          </div>
        )}

        <div className="claim-detail__field">
          <strong>Creation Time:</strong> {formatDate(claim.creationTime)}
        </div>

        {claim.deletionTime && (
          <div className="claim-detail__field">
            <strong>Deletion Time:</strong> {formatDate(claim.deletionTime)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimDetail;
