import type React from 'react';
import { useId } from 'react';
import CustomResourcePickerInput from '@/components/universals/forms/CustomResourcePickerInput';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import type { TGeneratedFormCustomResourcePickerInput } from '@/components/universals/forms/generated/GeneratedForm.type';
import { nestedFormUtils } from '@/components/universals/forms/generated/inputs/nested/nested-form.utils';

type GeneratedFormCustomResourcePickerInputProps = {
  input: TGeneratedFormCustomResourcePickerInput;
};

const GeneratedFormCustomResourcePickerInput: React.FunctionComponent<
  GeneratedFormCustomResourcePickerInputProps
> = ({ input }) => {
  const id = useId();
  const name = nestedFormUtils.useInputName(input.id);

  return (
    <FieldsetRow label={<label htmlFor={id}>{input.label}</label>}>
      <CustomResourcePickerInput
        id={id}
        name={name}
        serviceId={input.serviceId}
        resourceId={input.resourceId}
        refValues={input.refValues}
      />
    </FieldsetRow>
  );
};

export default GeneratedFormCustomResourcePickerInput;
