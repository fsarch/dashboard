'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Formik } from "formik";
import Input from "@/components/universals/forms/Input";
import Button from "@/components/universals/forms/Button";
import { useRouter } from "next/navigation";
import {
  connectPartPartId,
  loadAvailableParts,
} from "@/components/apps/material-tracing/part/PartPartIdConnectForm.server-action";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";
import SearchableSelect from "@/components/universals/forms/searchable-select/SearchableSelect.component";
import { TPart } from "@/services/material-tracing/part.type";

type PartPartIdConnectFormProps = {
  partId: string;
};

type ConnectPartPartIdFormData = {
  childPartId: string;
  amount: string;
};

export const PartPartIdConnectForm: React.FunctionComponent<PartPartIdConnectFormProps> = ({
  partId,
}) => {
  const router = useRouter();
  const [allParts, setAllParts] = useState<TPart[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all parts for the dropdown
  useEffect(() => {
    const loadParts = async () => {
      try {
        setLoading(true);
        const parts = await loadAvailableParts(partId);
        setAllParts(parts);
      } catch (error) {
        console.error('Failed to load parts:', error);
        setAllParts([]);
      } finally {
        setLoading(false);
      }
    };

    loadParts();
  }, [partId]);

  const handleSubmit = useCallback(async (value: ConnectPartPartIdFormData) => {
    await connectPartPartId({
      value: {
        childPartId: value.childPartId,
        amount: parseInt(value.amount, 10),
      },
      partId,
    });
    router.refresh();
  }, [router, partId]);

  // Convert parts to format expected by SearchableSelect
  const partOptions = allParts.map(part => ({
    id: part.id,
    value: part.id,
    label: `${part.name} (ID: ${part.id})`,
  }));

  if (loading) {
    return <div>Loading parts...</div>;
  }

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        childPartId: '',
        amount: '1',
      }}
    >
      <Form>
        <Fieldset>
          <FieldsetRow
            label={(
              <label htmlFor="part-part-id">Part</label>
            )}
          >
            <SearchableSelect
              id="part-part-id"
              name="childPartId"
              values={partOptions}
            />
          </FieldsetRow>
          <FieldsetRow
            label={(
              <label htmlFor="part-part-amount">Anzahl</label>
            )}
          >
            <Input id="part-part-amount" name="amount" type="number"/>
          </FieldsetRow>
        </Fieldset>
        <Button type="submit">
          Verbinden
        </Button>
      </Form>
    </Formik>
  );
};