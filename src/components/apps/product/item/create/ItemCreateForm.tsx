'use client';

import { Form, Formik, type FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { createItem } from '@/components/apps/product/item/create/ItemCreateForm.server-action';
import Button from '@/components/universals/forms/Button';
import Fieldset from '@/components/universals/forms/Fieldset.component';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import Input from '@/components/universals/forms/Input';
import Select from '@/components/universals/forms/Select';
import SimpleFieldsetRow from '@/components/universals/forms/SimpleFieldsetRow.component';
import type { ItemCreateDto } from '@/services/product/item.type';
import type { ItemTypeDto } from '@/services/product/item-type.type';

type ItemCreateFormProps = {
  catalogId: string;
  itemTypes: Array<ItemTypeDto>;
  parentItemId?: string;
};

const ItemCreateForm: React.FunctionComponent<ItemCreateFormProps> = ({
  itemTypes,
  catalogId,
  parentItemId,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: ItemCreateDto, helpers: FormikHelpers<ItemCreateDto>) => {
      await createItem(catalogId, {
        ...values,
        parentItemId,
      });

      helpers.resetForm();

      router.refresh();
    },
    [catalogId, router, parentItemId],
  );

  return (
    <Formik
      initialValues={{
        itemTypeId: itemTypes[0].id,
        name: '',
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <Fieldset>
          <SimpleFieldsetRow label="Name">
            {(id) => <Input id={id} name="name" type="input" required />}
          </SimpleFieldsetRow>
          <SimpleFieldsetRow label="Item-Type">
            {(id) => (
              <Select
                id={id}
                name="itemTypeId"
                values={itemTypes.map((itemType) => ({
                  value: itemType.id,
                  label: itemType.name,
                }))}
              />
            )}
          </SimpleFieldsetRow>
          <Button type="submit">Erstellen</Button>
        </Fieldset>
      </Form>
    </Formik>
  );
};

export default ItemCreateForm;
