import { Field } from 'formik';
import type React from 'react';
import { useId } from 'react';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import type { TGeneratedFormColorInput } from '@/components/universals/forms/generated/GeneratedForm.type';
import { nestedFormUtils } from '@/components/universals/forms/generated/inputs/nested/nested-form.utils';
import styles from './GeneratedFormColorInput.module.scss';

type GeneratedFormColorInputProps = {
  input: TGeneratedFormColorInput;
};

const GeneratedFormColorInput: React.FunctionComponent<
  GeneratedFormColorInputProps
> = ({ input }) => {
  const id = useId();
  const name = nestedFormUtils.useInputName(input.id);

  return (
    <FieldsetRow label={<label htmlFor={id}>{input.label}</label>}>
      <div className={styles.root}>
        <Field
          id={id}
          name={name}
          type="color"
          className={styles.colorInput}
          disabled={input.isEnabled === false}
        />
        <Field
          name={name}
          type="text"
          className={styles.colorText}
          placeholder="#000000"
          disabled={input.isEnabled === false}
        />
      </div>
    </FieldsetRow>
  );
};

export default GeneratedFormColorInput;
