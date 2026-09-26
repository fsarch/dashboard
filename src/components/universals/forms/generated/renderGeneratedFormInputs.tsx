import type { TGeneratedFormInput } from '@/components/universals/forms/generated/GeneratedForm.type';
import GeneratedFormCheckboxInput from '@/components/universals/forms/generated/inputs/GeneratedFormCheckboxInput.component';
import GeneratedFormColorInput from '@/components/universals/forms/generated/inputs/GeneratedFormColorInput.component';
import GeneratedFormCustomResourcePickerInput from '@/components/universals/forms/generated/inputs/GeneratedFormCustomResourcePickerInput.component';
import GeneratedFormFileUploadInput from '@/components/universals/forms/generated/inputs/GeneratedFormFileUploadInput.component';
import GeneratedFormImageServerUploadInput from '@/components/universals/forms/generated/inputs/GeneratedFormImageServerUploadInput.component';
import GeneratedFormLinkCardInput from '@/components/universals/forms/generated/inputs/GeneratedFormLinkCardInput.component';
import GeneratedFormNumberInput from '@/components/universals/forms/generated/inputs/GeneratedFormNumberInput.component';
import GeneratedFormPasswordInput from '@/components/universals/forms/generated/inputs/GeneratedFormPasswordInput.component';
import GeneratedFormSelectInput from '@/components/universals/forms/generated/inputs/GeneratedFormSelectInput.component';
import GeneratedFormTextAreaInput from '@/components/universals/forms/generated/inputs/GeneratedFormTextAreaInput.component';
import GeneratedFormTextInput from '@/components/universals/forms/generated/inputs/GeneratedFormTextInput.component';
import GeneratedFormTimeInput from '@/components/universals/forms/generated/inputs/GeneratedFormTimeInput.component';
import GeneratedNestedForm from '@/components/universals/forms/generated/inputs/nested/GeneratedFormNestedForm.component';

export function renderGeneratedFormInput(input: TGeneratedFormInput) {
  if (input.$type === 'text') {
    return <GeneratedFormTextInput key={input.id} input={input} />;
  }

  if (input.$type === 'textarea') {
    return <GeneratedFormTextAreaInput key={input.id} input={input} />;
  }

  if (input.$type === 'password') {
    return <GeneratedFormPasswordInput key={input.id} input={input} />;
  }

  if (input.$type === 'color') {
    return <GeneratedFormColorInput key={input.id} input={input} />;
  }

  if (input.$type === 'select') {
    return <GeneratedFormSelectInput key={input.id} input={input} />;
  }

  if (input.$type === 'number') {
    return <GeneratedFormNumberInput key={input.id} input={input} />;
  }

  if (input.$type === 'time') {
    return <GeneratedFormTimeInput key={input.id} input={input} />;
  }

  if (input.$type === 'image-server-upload') {
    return <GeneratedFormImageServerUploadInput key={input.id} input={input} />;
  }

  if (input.$type === 'file-upload') {
    return <GeneratedFormFileUploadInput key={input.id} input={input} />;
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
    return <GeneratedFormCheckboxInput key={input.id} input={input} />;
  }

  if (input.$type === 'link-card') {
    return <GeneratedFormLinkCardInput key={input.id} input={input} />;
  }

  if (input.$type === 'custom-resource-picker') {
    return (
      <GeneratedFormCustomResourcePickerInput key={input.id} input={input} />
    );
  }

  return null;
}

export function renderGeneratedFormInputs(inputs: Array<TGeneratedFormInput>) {
  return inputs.map((input) => renderGeneratedFormInput(input));
}

export type TRenderGeneratedFormInputsFunc = typeof renderGeneratedFormInputs;
