import React from 'react';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import LinkCard from '@/components/universals/link-card/LinkCard.component';
import styles from './ShortCodeLinkedCard.module.scss';

type ShortCodeLinkedCardProps = {
  code: string;
  label?: string;
};

const ShortCodeLinkedCard: React.FunctionComponent<ShortCodeLinkedCardProps> = async ({
  code,
  label = 'ShortCode',
}) => {
  const shortCodeUrl = await getServiceLocalUrl(`/short-code/${code}`);

  return (
    <LinkCard href={shortCodeUrl} className={styles.root}>
      <div className={styles.label}>{label}</div>
      <div className={styles.code}>{code}</div>
    </LinkCard>
  );
};

export default ShortCodeLinkedCard;

