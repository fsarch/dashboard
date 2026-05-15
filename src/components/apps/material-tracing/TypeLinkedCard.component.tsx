import React from 'react';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import LinkCard from '@/components/universals/link-card/LinkCard.component';
import styles from './TypeLinkedCard.module.scss';

type TypeLinkedCardProps = {
  name: string;
  path: string;
};

const TypeLinkedCard: React.FunctionComponent<TypeLinkedCardProps> = async ({
  name,
  path,
}) => {
  const href = await getServiceLocalUrl(path);

  return (
    <LinkCard href={href}>
      <div className={styles.name}>{name}</div>
    </LinkCard>
  );
};

export default TypeLinkedCard;

