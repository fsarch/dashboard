'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './SegmentedControl.module.scss';

export type SegmentedControlOption<T extends string> = {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<SegmentedControlOption<T>>;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

// A large, button-styled picker for a small, fixed set of mutually
// exclusive values ("enum" fields - a shape's type, a layer's type, the
// constant/parameter mode toggle, ...) - an alternative to a native
// <select> for exactly the cases where there are only a couple of options
// and a full-width button group reads more clearly at a glance than a
// dropdown. The selected segment is filled with the app's theme primary
// color (--color-primary-rgb, set on <body> in app/layout.tsx).
//
// Plain controlled component (value/onChange), like SearchInput/
// EmailSortSelect elsewhere in this folder - not Formik-bound, so it drops
// straight into non-Formik state (e.g. image-editor-server's layer editor,
// which manages its own state directly). Wrap it in a thin Formik-aware
// adapter (mirroring how Select.tsx wraps a plain <select> in Formik's
// <Field>) if a Formik-driven form ever needs the same look.
function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  disabled,
  className,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div className={clsx(styles.root, className)} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={clsx(styles.segment, isSelected && styles.selected)}
            disabled={disabled || option.disabled}
            onClick={() => !isSelected && onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
