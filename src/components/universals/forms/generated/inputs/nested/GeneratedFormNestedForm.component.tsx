import React, { useCallback } from 'react';
import { TGeneratedNestedForm } from "@/components/universals/forms/generated/GeneratedForm.type";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";
import { useFormikContext } from "formik";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import type { TRenderGeneratedFormInputsFunc } from "@/components/universals/forms/generated/renderGeneratedFormInputs";
import styles from './GeneratedFormNestedForm.module.scss';
import { NestedFormContextProvider } from "@/components/universals/forms/generated/inputs/nested/nested-form.context";
import IconButton from "@/components/universals/forms/button/IconButton";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import ConfirmDialog from "@/components/universals/dialogs/confirm/ConfirmDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";

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

  const openDialog = useOpenDialog();

  const handleDelete = useCallback(async (value: unknown) => {
    const dialogResult = await openDialog(ConfirmDialog, {
      text: 'Möchten Sie dieses Element wirklich löschen?',
    }).result;

    if (dialogResult.status !== DialogResult.SUCCESS) {
      return;
    }

    setValues((val: any) => {
      const idx = val?.[input.id]?.indexOf(value);
      if (idx === undefined || idx === null || idx === -1) {
        return val;
      }

      const updatedArray = [...(val[input.id] ?? [])];
      updatedArray.splice(idx, 1);
      return {
        ...val,
        [input.id]: updatedArray,
      };
    });
  }, [setValues, input.id]);

  return (
    <FieldsetRow label={input.label}>
      <div className={styles.fieldsetWrapper}>
        {elements.map((value, index) => (
          <div
            key={index}
            className={styles.itemWrapper}
          >
            <div className={styles.itemHeadlineWrapper}>
              <div className={styles.itemHeadline}>
                Element {index}
              </div>
              <div>
                <IconButton
                  type="button"
                  icon="trash-can"
                  onClick={() => handleDelete(value)}
                />
              </div>
            </div>
            <Fieldset
              className={styles.fieldset}
            >
              <NestedFormContextProvider
                value={{ path: [input.id, index] }}
              >
                {renderFormInputs(input.inputs)}
              </NestedFormContextProvider>
            </Fieldset>
          </div>
        ))}
        <button type="button" onClick={handleCreate}>Element hinzufügen</button>
      </div>
    </FieldsetRow>
  );
};

export default GeneratedNestedForm;
