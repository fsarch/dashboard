import React from 'react';

type CircleIconProps = {
  enableAnimation?: boolean; // Optional prop to enable/disable animation
  style?: React.CSSProperties; // Optional style prop for custom styling
  className?: string;
};

const CircleIcon: React.FunctionComponent<CircleIconProps> = ({
  enableAnimation = false,
  style,
  className,
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="1em" height="1em"
         className={className} style={style} aria-hidden="true" focusable="false">
      <defs>
        {/* nutzt die von außen gesetzte 'color' */}
        <radialGradient id="donutGradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="var(--ai-color-background)" stopOpacity="0.9"/>
          <stop offset="45%" stopColor="currentColor" stopOpacity="0.70"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
        </radialGradient>

        <mask id="donutMask">
          <rect width="100%" height="100%" fill="white"/>
          <circle cx="110" cy="110" r="55" fill="black"/>
        </mask>
      </defs>

      <g>
        {/* unregelmäßige, seltene Hin-/Rückbewegungen */}
        {enableAnimation && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="28s"
            repeatCount="indefinite"
            calcMode="spline"
            values="
              0 110 110; 0 110 110;
              16 110 110; 16 110 110; 0 110 110; 0 110 110;
              -10 110 110; -10 110 110; 0 110 110; 0 110 110;
              24 110 110; 24 110 110; 0 110 110; 0 110 110
            "
            keyTimes="
              0.00; 0.52;
              0.56; 0.60; 0.64; 0.74;
              0.78; 0.81; 0.84; 0.92;
              0.95; 0.97; 0.99; 1.00
            "
            keySplines="
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1;
              0.2 0 0.2 1
            "
          />
        )}

        <circle cx="110" cy="110" r="90" fill="url(#donutGradient)" mask="url(#donutMask)"/>

        <circle cx="110" cy="110" r="90"
                fill="none"
                stroke="var(--ai-color-secondary)"
                strokeOpacity="0.8"
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray="90 480"
                mask="url(#donutMask)"/>
      </g>
    </svg>
  );
};

export default CircleIcon;
