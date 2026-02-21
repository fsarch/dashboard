import React from 'react';
import CircleIcon from './CircleIcon';

type AiIconProps = {
  enableAnimation?: boolean;
  /** CSS color string — will be exposed as --color-primary on the wrapper */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

const AiIcon: React.FC<AiIconProps> = ({
  enableAnimation = false,
  color = 'color-mix(in srgb, rgb(var(--color-primary-rgb)) 60%, #000000)',
  className,
  style,
}) => {
  const varStyle: React.CSSProperties = { ...(style || {}) } as React.CSSProperties;
  if (color) {
    // expose the provided color as a CSS variable so CircleIcon can use currentColor or var(--color-primary)
    (varStyle as any)['--ai-color-primary'] = 'rgb(var(--color-primary-rgb))';
    (varStyle as any)['--ai-color-background'] = 'color-mix(in srgb, var(--ai-color-primary) 20%, #000000)';
    (varStyle as any)['--ai-color-secondary'] = 'var(--ai-color-primary)';
    varStyle.color = 'color-mix(in srgb, var(--ai-color-primary) 60%, #000000)';
  }

  return (
    <CircleIcon
      enableAnimation={enableAnimation}
      style={varStyle}
      className={className}
    />
  );
};

export default AiIcon;

