import { TGeneratedFormInput } from "@/components/universals/forms/generated/GeneratedForm.type";
import GeneratedFormTextInput from "@/components/universals/forms/generated/inputs/GeneratedFormTextInput.component";
import GeneratedFormSelectInput
  from "@/components/universals/forms/generated/inputs/GeneratedFormSelectInput.component";
import GeneratedFormImageServerUploadInput
  from "@/components/universals/forms/generated/inputs/GeneratedFormImageServerUploadInput.component";
import GeneratedNestedForm from "@/components/universals/forms/generated/inputs/nested/GeneratedFormNestedForm.component";
import GeneratedFormTimeInput from "@/components/universals/forms/generated/inputs/GeneratedFormTimeInput.component";
import GeneratedFormNumberInput
  from "@/components/universals/forms/generated/inputs/GeneratedFormNumberInput.component";
import GeneratedFormCheckboxInput from "@/components/universals/forms/generated/inputs/GeneratedFormCheckboxInput.component";

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

  if (input.$type === 'number') {
    return (
      <GeneratedFormNumberInput
        key={input.id}
        input={input}
      />
    );
  }

  if (input.$type === 'time') {
    return (
      <GeneratedFormTimeInput
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

  if (input.$type === 'checkbox') {
    return (
      <GeneratedFormCheckboxInput
        key={input.id}
        input={input}
      />
    );
  }

  return null;
}

export function renderGeneratedFormInputs(inputs: Array<TGeneratedFormInput>) {
  return inputs.map((input) => renderGeneratedFormInput(input));
}

export type TRenderGeneratedFormInputsFunc = typeof renderGeneratedFormInputs;
