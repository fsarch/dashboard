import React, { useId } from 'react';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import { TGeneratedFormCheckboxInput } from '@/components/universals/forms/generated/GeneratedForm.type';
import { nestedFormUtils } from '@/components/universals/forms/generated/inputs/nested/nested-form.utils';
import { Field } from "formik";
import styles from './GeneratedFormCheckboxInput.module.scss';

type Props = {
  input: TGeneratedFormCheckboxInput;
};

const GeneratedFormCheckboxInput: React.FunctionComponent<Props> = ({ input }) => {
  const id = useId();
  const name = nestedFormUtils.useInputName(input.id);
  const isToggle = input.variant === 'toggle';

  return (
    <FieldsetRow
      label={(
        <label htmlFor={id}>{input.label}</label>
      )}
    >
      {isToggle ? (
        <span className={styles.toggle}>
          <Field
            id={id}
            name={name}
            type="checkbox"
            disabled={input.isEnabled === false}
            className={styles.toggleInput}
          />
          <span className={styles.toggleTrack}>
            <span className={styles.toggleThumb} />
          </span>
        </span>
      ) : (
        <Field
          id={id}
          name={name}
          type="checkbox"
          disabled={input.isEnabled === false}
        />
      )}
    </FieldsetRow>
  );
};

export default GeneratedFormCheckboxInput;

