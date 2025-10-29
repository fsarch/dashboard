import React from 'react';
import { TGeneratedNestedForm } from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import type { TRenderGeneratedFormInputsFunc } from "@/components/universals/forms/generated/renderGeneratedFormInputs";
import styles from './GeneratedFormNestedForm.module.scss';
import { NestedFormContextProvider } from "@/components/universals/forms/generated/inputs/nested/nested-form.context";

type GeneratedNestedFormSingleProps = {
  input: TGeneratedNestedForm;
  renderFormInputs: TRenderGeneratedFormInputsFunc;
};

export const GeneratedNestedFormSingle: React.FunctionComponent<GeneratedNestedFormSingleProps> = ({
  input,
  renderFormInputs,
}) => {
  return (
    <FieldsetRow label={input.label}>
      <div className={styles.fieldsetWrapper}>
        <div
          className={styles.itemWrapper}
        >
          <div className={styles.itemHeadlineWrapper}>
            <div className={styles.itemHeadline}>
            </div>
          </div>
          <Fieldset
            className={styles.fieldset}
          >
            <NestedFormContextProvider
              value={{ path: [input.id] }}
            >
              {renderFormInputs(input.inputs)}
            </NestedFormContextProvider>
          </Fieldset>
        </div>
      </div>
    </FieldsetRow>
  );
};
