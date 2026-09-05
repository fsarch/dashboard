import React, { CSSProperties, PropsWithChildren } from 'react';
import styles from './Section.module.scss';
import clsx from "clsx";

type SectionProps = PropsWithChildren<{
  name: string;
  color?: string;
  className?: string;
  addPadding?: boolean;
  transparent?: boolean;
}>;

const Section: React.FunctionComponent<SectionProps> = ({
  name,
  color,
  children,
  addPadding = true,
  className,
  transparent,
}) => {
  return (
    <fieldset
      style={{
        '--color': color,
      } as CSSProperties}
      className={clsx(className, styles.root, addPadding && styles.rootWithPadding, transparent && styles.rootTransparent)}
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
