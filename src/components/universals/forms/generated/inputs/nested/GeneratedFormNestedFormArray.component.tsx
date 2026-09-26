import { useFormikContext } from 'formik';
import type React from 'react';
import { useCallback } from 'react';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import Button from '@/components/universals/forms/Button';
import IconButton from '@/components/universals/forms/button/IconButton';
import Fieldset from '@/components/universals/forms/Fieldset.component';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import type { TGeneratedNestedForm } from '@/components/universals/forms/generated/GeneratedForm.type';
import { NestedFormContextProvider } from '@/components/universals/forms/generated/inputs/nested/nested-form.context';
import type { TRenderGeneratedFormInputsFunc } from '@/components/universals/forms/generated/renderGeneratedFormInputs';
import sharedStyles from './GeneratedFormNestedForm.module.scss';
import arrayStyles from './GeneratedFormNestedFormArray.module.scss';

type GeneratedNestedFormArrayProps = {
  input: TGeneratedNestedForm;
  renderFormInputs: TRenderGeneratedFormInputsFunc;
};

export const GeneratedNestedFormArray: React.FunctionComponent<
  GeneratedNestedFormArrayProps
> = ({ input, renderFormInputs }) => {
  const { values, setValues } = useFormikContext<any>();
  const elements = (values?.[input.id] ?? []) as Array<unknown>;

  const handleCreate = useCallback(() => {
    setValues((val: any) => ({
      ...val,
      [input.id]: [...(val?.[input.id] ?? []), { ...input.addInitialValues }],
    }));
  }, [setValues, input.addInitialValues, input.id]);

  const openDeleteDialog = useOpenDeleteDialog();

  const handleDelete = useCallback(
    async (value: unknown) => {
      const dialogResult = await openDeleteDialog({
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
    },
    [setValues, input.id],
  );

  return (
    <FieldsetRow label={input.label}>
      <div className={sharedStyles.fieldsetWrapper}>
        {elements.map((value, index) => (
          <div key={index} className={sharedStyles.itemWrapper}>
            <div className={arrayStyles.itemHeadlineWrapper}>
              <div className={sharedStyles.itemHeadline}>
                Element {index + 1}
              </div>
              <div>
                <IconButton
                  type="button"
                  icon="trash-can"
                  onClick={() => handleDelete(value)}
                />
              </div>
            </div>
            <Fieldset className={sharedStyles.fieldset}>
              <NestedFormContextProvider value={{ path: [input.id, index] }}>
                {renderFormInputs(input.inputs)}
              </NestedFormContextProvider>
            </Fieldset>
          </div>
        ))}
        <Button type="button" onClick={handleCreate}>
          + Element hinzufügen
        </Button>
      </div>
    </FieldsetRow>
  );
};
