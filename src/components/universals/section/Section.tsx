import React, { PropsWithChildren } from 'react';
import styles from './Section.module.scss';

type SectionProps = PropsWithChildren<{
  name: string;
}>;

const Section: React.FunctionComponent<SectionProps> = ({
  name,
  children,
}) => {
  return (
    <fieldset className={styles.root}>
      <legend>
        {name}
      </legend>
      <div>
        {children}
      </div>
    </fieldset>
  );
};

export default Section;
