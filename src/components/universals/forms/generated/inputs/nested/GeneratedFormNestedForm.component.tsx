import React from 'react';
import { TGeneratedNestedForm } from "@/components/universals/forms/generated/GeneratedForm.type";
import type { TRenderGeneratedFormInputsFunc } from "@/components/universals/forms/generated/renderGeneratedFormInputs";
import {
  GeneratedNestedFormArray
} from "@/components/universals/forms/generated/inputs/nested/GeneratedFormNestedFormArray.component";
import {
  GeneratedNestedFormSingle
} from "@/components/universals/forms/generated/inputs/nested/GeneratedFormNestedFormSingle.component";

type GeneratedNestedFormProps = {
  input: TGeneratedNestedForm;
  renderFormInputs: TRenderGeneratedFormInputsFunc;
};

const GeneratedNestedForm: React.FunctionComponent<GeneratedNestedFormProps> = ({
  input,
  renderFormInputs,
}) => {
  if (input.isArray) {
    return <GeneratedNestedFormArray input={input} renderFormInputs={renderFormInputs} />
  }

  return <GeneratedNestedFormSingle input={input} renderFormInputs={renderFormInputs} />
};

export default GeneratedNestedForm;
