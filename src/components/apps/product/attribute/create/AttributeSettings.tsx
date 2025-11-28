import React from 'react';
import { useFormikContext } from "formik";
import { AttributeCreateDto } from "@/services/product/attribute.type";
import { AttributeType } from "@/services/product/attribute.const";
import AttributeJsonSettings from './AttributeJsonSettings';
import AttributeTextSettings from './AttributeTextSettings';
import AttributeNumberSettings from './AttributeNumberSettings';
import AttributeLinkSettings from './AttributeLinkSettings';
import AttributeImageSettings from "@/components/apps/product/attribute/create/AttributeImageSettings";

type AttributeSettingsProps = {
  catalogId: string;
};

const AttributeSettings: React.FunctionComponent<AttributeSettingsProps> = ({
  catalogId,
}) => {
  const { values } = useFormikContext<AttributeCreateDto>();

  if (values.attributeTypeId === AttributeType.JSON) {
    return (
      <AttributeJsonSettings/>
    );
  }

  if (values.attributeTypeId === AttributeType.TEXT) {
    return (
      <AttributeTextSettings/>
    );
  }

  if (values.attributeTypeId === AttributeType.NUMBER) {
    return (
      <AttributeNumberSettings/>
    );
  }

  if (values.attributeTypeId === AttributeType.LINK) {
    return (
      <AttributeLinkSettings
        catalogId={catalogId}
      />
    );
  }

  if (values.attributeTypeId === AttributeType.IMAGE) {
    return (
      <AttributeImageSettings/>
    );
  }

  return (
    <div>

    </div>
  );
};

export default AttributeSettings;
