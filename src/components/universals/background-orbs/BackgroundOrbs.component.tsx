import React, { CSSProperties } from 'react';
import clsx from 'clsx';
import Color from 'color';
import { getThemeConfiguration } from '@/utils/configuration.utils';
import styles from './BackgroundOrbs.module.css';

type BackgroundOrbsProps = {
  /** Whether the circles slowly drift across the screen. Defaults to true. */
  animated?: boolean;
};

/**
 * Decorative, fixed full-viewport layer of large, softly-faded, colored
 * circles derived from the configured theme `primary_color` (original +
 * three hue-rotated variants). Sits behind page content (z-index: 0) and
 * ignores pointer events.
 *
 * Deliberately uses `radial-gradient` fades instead of `filter: blur()` and
 * (optionally) skips the drift animation — both real GPU cost on a layer
 * that can be present on every page.
 */
export const BackgroundOrbs: React.FunctionComponent<BackgroundOrbsProps> = async ({
  animated = true,
}) => {
  const theme = await getThemeConfiguration();
  const primaryColor = Color(theme.primaryColor.hex);

  const style = {
    '--orb1-rgb': primaryColor.rgb().array().join(', '),
    '--orb2-rgb': primaryColor.rotate(40).rgb().array().join(', '),
    '--orb3-rgb': primaryColor.rotate(-40).lighten(0.15).rgb().array().join(', '),
    '--orb4-rgb': primaryColor.rotate(150).rgb().array().join(', '),
  } as CSSProperties;

  return (
    <div
      className={clsx(styles.orbLayer, !animated && styles.orbLayerStatic)}
      style={style}
      aria-hidden="true"
    >
      <span className={clsx(styles.orb, styles.orb1)} />
      <span className={clsx(styles.orb, styles.orb2)} />
      <span className={clsx(styles.orb, styles.orb3)} />
      <span className={clsx(styles.orb, styles.orb4)} />
    </div>
  );
};

export default BackgroundOrbs;
