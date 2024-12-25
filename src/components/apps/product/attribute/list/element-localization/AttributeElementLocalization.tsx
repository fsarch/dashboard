'use client';

import React, { useCallback } from 'react';
import {
  AttributeLocalizationDto,
  ElementLocalizationCreateDto,
  ElementLocalizationDto
} from "@/services/product/attribute.type";
import { useRouter } from "next/navigation";
import {
  updateAttributeLocalization
} from "@/components/apps/product/attribute/localization/AttributeLocalization.server-action";
import { Form, Formik } from "formik";
import Input from "@/components/universals/forms/Input";
import Button from "@/components/universals/forms/Button";
import TextArea from "@/components/universals/forms/TextArea";
import {
  setAttributeElementLocalization
} from "@/components/apps/product/attribute/list/element-localization/AttributeElementLocalization.server-action";

type AttributeElementLocalizationProps = {
  catalogId: string;
  attributeId: string;
  elementId: string;
  localizationId: string;
  elementLocalization?: ElementLocalizationDto;
};

const AttributeElementLocalization: React.FunctionComponent<AttributeElementLocalizationProps> = ({
  catalogId,
  attributeId,
  elementId,
  localizationId,
  elementLocalization,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (values: ElementLocalizationCreateDto) => {
    await setAttributeElementLocalization(catalogId, attributeId, elementId, localizationId, values);

    router.refresh();
  }, [catalogId, attributeId, elementId, localizationId, router]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
        content: '',
        ...elementLocalization,
        localizationId,
      }}
    >
      <Form>
        <Input name="name" type="input"/>
        <TextArea name="content" />
        <Button type="submit">Speichern</Button>
      </Form>
    </Formik>
  );
};

export default AttributeElementLocalization;
