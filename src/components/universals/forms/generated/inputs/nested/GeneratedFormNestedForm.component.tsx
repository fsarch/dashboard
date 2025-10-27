import React, { useCallback } from 'react';
import { TGeneratedNestedForm } from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";
import { useFormikContext } from "formik";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import type { TRenderGeneratedFormInputsFunc } from "@/components/universals/forms/generated/renderGeneratedFormInputs";
import styles from './GeneratedFormNestedForm.module.scss';
import { NestedFormContextProvider } from "@/components/universals/forms/generated/inputs/nested/nested-form.context";

type GeneratedNestedFormProps = {
  input: TGeneratedNestedForm;
  renderFormInputs: TRenderGeneratedFormInputsFunc;
};

const GeneratedNestedForm: React.FunctionComponent<GeneratedNestedFormProps> = ({
  input,
  renderFormInputs,
}) => {
  const { values, setValues } = useFormikContext<any>();
  const elements = (values?.[input.id] ?? []) as Array<unknown>;

  const handleCreate = useCallback(() => {
    setValues((val: any) => ({
      ...val,
      [input.id]: [...(val?.[input.id] ?? []), { ...input.addInitialValues }],
    }));
  }, [setValues, input.addInitialValues, input.id]);

  return (
    <FieldsetRow label={input.label}>
      Nested Form
      <div className={styles.fieldsetWrapper}>
        {elements.map((value, index) => (
          <Fieldset
            key={index}
            className={styles.fieldset}
          >
            <NestedFormContextProvider
              value={{ path: [input.id, index] }}
            >
              Element {index}

              {renderFormInputs(input.inputs)}
            </NestedFormContextProvider>
          </Fieldset>
        ))}
        <button type="button" onClick={handleCreate}>Element hinzufügen</button>
      </div>
    </FieldsetRow>
  );
};

export default GeneratedNestedForm;
