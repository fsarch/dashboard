import React, { CSSProperties, PropsWithChildren } from 'react';
import styles from './Section.module.scss';
import clsx from "clsx";

type SectionProps = PropsWithChildren<{
  name: string;
  color?: string;
  className?: string;
}>;

const Section: React.FunctionComponent<SectionProps> = ({
  name,
  color,
  children,
  className,
}) => {
  console.log(color);
  return (
    <fieldset
      style={{
        '--color': color,
      } as CSSProperties}
      className={clsx(className, styles.root)}
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
