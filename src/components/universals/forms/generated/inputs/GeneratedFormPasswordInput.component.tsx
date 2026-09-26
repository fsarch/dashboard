import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type React from 'react';
import { useId, useState } from 'react';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import type { TGeneratedFormPasswordInput } from '@/components/universals/forms/generated/GeneratedForm.type';
import { nestedFormUtils } from '@/components/universals/forms/generated/inputs/nested/nested-form.utils';
import Input from '@/components/universals/forms/Input';
import styles from './GeneratedFormPasswordInput.module.scss';

type GeneratedFormPasswordInputProps = {
  input: TGeneratedFormPasswordInput;
};

const GeneratedFormPasswordInput: React.FunctionComponent<
  GeneratedFormPasswordInputProps
> = ({ input }) => {
  const id = useId();
  const name = nestedFormUtils.useInputName(input.id);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FieldsetRow label={<label htmlFor={id}>{input.label}</label>}>
      <div className={styles.root}>
        <Input
          id={id}
          name={name}
          type={isVisible ? 'text' : 'password'}
          disabled={input.isEnabled === false}
          className={styles.input}
        />
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsVisible(!isVisible)}
          aria-label={isVisible ? 'Passwort ausblenden' : 'Passwort anzeigen'}
          disabled={input.isEnabled === false}
        >
          <FontAwesomeIcon icon={isVisible ? faEyeSlash : faEye} />
        </button>
      </div>
    </FieldsetRow>
  );
};

export default GeneratedFormPasswordInput;
