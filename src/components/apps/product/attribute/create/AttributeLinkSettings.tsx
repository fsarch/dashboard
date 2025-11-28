import React, { useEffect, useMemo } from 'react';
import { useServerActionData } from "@/utils/hooks/useServerActionData.hook";
import { loadItemTypes } from "@/components/apps/product/attribute/create/AttributeLinkSettings.server-action";
import { useFormikContext } from "formik";
import { useSyncedRef } from "@/utils/hooks/useSyncedRef.hook";
import Select from "@/components/universals/forms/Select";
import SimpleFieldsetRow from "@/components/universals/forms/SimpleFieldsetRow.component";

type AttributeLinkSettingsProps = {
  catalogId: string;
};

const AttributeLinkSettings: React.FunctionComponent<AttributeLinkSettingsProps> = ({
  catalogId,
}) => {
  const { data, isLoading } = useServerActionData(loadItemTypes, [catalogId]);

  const formikContext = useFormikContext();
  const formikStatusRef = useSyncedRef(formikContext.status);

  useEffect(() => {
    console.log('isLoading', isLoading);
    if (!isLoading) {
      return;
    }

    const currentLoadingData = formikStatusRef.current?.loadingData ? [...formikStatusRef.current.loadingData].filter(s => s !== 'attribute.link') : [];

    currentLoadingData.push('attribute.link');

    formikContext.setStatus({ loadingData: currentLoadingData });

    return () => {
      const currentLoadingData = formikStatusRef.current?.loadingData ? [...formikStatusRef.current.loadingData].filter(s => s !== 'attribute.link') : [];

      formikContext.setStatus({ loadingData: currentLoadingData });
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || !data) {
      return;
    }

    console.log('data changed', data);

    if (!data.length) {
      return;
    }

    formikContext.setFieldValue('itemTypeId', data[0].id);
  }, [isLoading]);

  const values = useMemo(() => {
    console.log('data', data);

    return (data ?? []).map((itemType) => ({
      label: itemType.name,
      value: itemType.id,
    }))
  }, [data]);

  return (
    <SimpleFieldsetRow label="ItemType">
      {(id) => (
        <Select
          id={id}
          name="itemTypeId"
          values={values}
        />
      )}
    </SimpleFieldsetRow>
  );
};

export default AttributeLinkSettings;
