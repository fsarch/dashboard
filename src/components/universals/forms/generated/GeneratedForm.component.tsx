import 'server-only';

import React from 'react';
import {
  TGeneratedFormDefinition,
  TGeneratedFormInitialValues, TGeneratedFormSelectConstantData
} from "@/components/universals/forms/generated/GeneratedForm.type";
import GeneratedClientForm from "@/components/universals/forms/generated/GeneratedClientForm.component";
import { fetchService } from "@/utils/fetchService";
import jsonata from "jsonata";

type GeneratedFormProps = {
  onSubmit: (data: TGeneratedFormInitialValues) => Promise<void>;
  definition: TGeneratedFormDefinition;
};

const GeneratedForm: React.FunctionComponent<GeneratedFormProps> = async ({
  onSubmit,
  definition,
}) => {
  const dataSourceData = Object.fromEntries(await Promise.all(Object.entries(definition.dataSources).map(async ([key, value]) => {
    const dataResponse = await fetchService(value.path, {
      method: value.method,
    });
    const rawData = await dataResponse.json();

    const transformedResponse = await (jsonata(value.transformResponse.value).evaluate({
      body: rawData,
    }));

    return [key, transformedResponse.body];
  })));

  const mappedInputs = definition.inputs.map((input) => {
    if (input.type === 'select' && input.data.$type === 'datasource') {
      return {
        ...input,
        data: {
          $type: 'constant',
          value: dataSourceData[input.data.value],
        } as TGeneratedFormSelectConstantData,
      }
    }

    return input;
  });

  const mappedInitialValues = definition.initialValues.$type === 'jsonata'
    ? await jsonata(definition.initialValues.value as string).evaluate({ dataSource: dataSourceData })
    : definition.initialValues;

  return (
    <GeneratedClientForm
      definition={mappedInputs}
      initialValues={mappedInitialValues}
      onSubmit={onSubmit}
    />
  );
};

export default GeneratedForm;
