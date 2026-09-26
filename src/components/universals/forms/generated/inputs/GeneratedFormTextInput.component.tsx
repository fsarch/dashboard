import type React from 'react';
import { useId } from 'react';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import type { TGeneratedFormTextInput } from '@/components/universals/forms/generated/GeneratedForm.type';
import { nestedFormUtils } from '@/components/universals/forms/generated/inputs/nested/nested-form.utils';
import Input from '@/components/universals/forms/Input';
import QrInput from '@/components/universals/forms/QrInput';

type GeneratedFormTextInputProps = {
  input: TGeneratedFormTextInput;
};

const GeneratedFormTextInput: React.FunctionComponent<
  GeneratedFormTextInputProps
> = ({ input }) => {
  const id = useId();
  const name = nestedFormUtils.useInputName(input.id);

  return (
    <FieldsetRow label={<label htmlFor={id}>{input.label}</label>}>
      {input.buttons && input.buttons[0].$type === 'qr-scanner' ? (
        <QrInput id={id} name={name} />
      ) : (
        <Input
          id={id}
          name={name}
          type="text"
          disabled={input.isEnabled === false}
        />
      )}
    </FieldsetRow>
  );
};

export default GeneratedFormTextInput;
