import React from 'react';
import Link from 'next/link';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
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
    <Link href={shortCodeUrl} className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.code}>{code}</div>
    </Link>
  );
};

export default ShortCodeLinkedCard;

