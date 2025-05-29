import React, { CSSProperties, PropsWithChildren } from 'react';
import styles from './Section.module.scss';

type SectionProps = PropsWithChildren<{
  name: string;
  color?: string;
}>;

const Section: React.FunctionComponent<SectionProps> = ({
  name,
  color,
  children,
}) => {
  return (
    <fieldset
      style={{
        '--color': color,
      } as CSSProperties}
      className={styles.root}
    >
      <legend className={styles.legend}>
        {name}
      </legend>
      <div>
        {children}
      </div>
    </fieldset>
  );
};

export default Section;
