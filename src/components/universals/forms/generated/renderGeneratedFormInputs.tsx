import { TGeneratedFormInput } from "@/components/universals/forms/generated/GeneratedForm.type";
import GeneratedFormTextInput from "@/components/universals/forms/generated/inputs/GeneratedFormTextInput.component";
import GeneratedFormSelectInput
  from "@/components/universals/forms/generated/inputs/GeneratedFormSelectInput.component";
import GeneratedFormImageServerUploadInput
  from "@/components/universals/forms/generated/inputs/GeneratedFormImageServerUploadInput.component";
import GeneratedNestedForm from "@/components/universals/forms/generated/inputs/nested/GeneratedFormNestedForm.component";

export function renderGeneratedFormInput(input: TGeneratedFormInput) {
  if (input.$type === 'text') {
    return (
      <GeneratedFormTextInput
        key={input.id}
        input={input}
      />
    );
  }

  if (input.$type === 'select') {
    return (
      <GeneratedFormSelectInput
        key={input.id}
        input={input}
      />
    );
  }

  if (input.$type === 'image-server-upload') {
    return (
      <GeneratedFormImageServerUploadInput
        key={input.id}
        input={input}
      />
    );
  }

  if (input.$type === 'nested-form') {
    return (
      <GeneratedNestedForm
        key={input.id}
        input={input}
        renderFormInputs={renderGeneratedFormInputs}
      />
    );
  }

  return null;
}

export function renderGeneratedFormInputs(inputs: Array<TGeneratedFormInput>) {
  return inputs.map((input) => renderGeneratedFormInput(input));
}

export type TRenderGeneratedFormInputsFunc = typeof renderGeneratedFormInputs;
