import type React from 'react';
import type { TGeneratedNestedForm } from '@/components/universals/forms/generated/GeneratedForm.type';
import { GeneratedNestedFormArray } from '@/components/universals/forms/generated/inputs/nested/GeneratedFormNestedFormArray.component';
import { GeneratedNestedFormSingle } from '@/components/universals/forms/generated/inputs/nested/GeneratedFormNestedFormSingle.component';
import type { TRenderGeneratedFormInputsFunc } from '@/components/universals/forms/generated/renderGeneratedFormInputs';

type GeneratedNestedFormProps = {
  input: TGeneratedNestedForm;
  renderFormInputs: TRenderGeneratedFormInputsFunc;
};

const GeneratedNestedForm: React.FunctionComponent<
  GeneratedNestedFormProps
> = ({ input, renderFormInputs }) => {
  if (input.isArray) {
    return (
      <GeneratedNestedFormArray
        input={input}
        renderFormInputs={renderFormInputs}
      />
    );
  }

  return (
    <GeneratedNestedFormSingle
      input={input}
      renderFormInputs={renderFormInputs}
    />
  );
};

export default GeneratedNestedForm;
