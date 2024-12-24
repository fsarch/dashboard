import React from 'react';
import { useFormikContext } from "formik";
import { AttributeCreateDto } from "@/services/product/attribute.type";
import { AttributeType } from "@/services/product/attribute.const";
import AttributeJsonSettings from './AttributeJsonSettings';
import AttributeTextSettings from './AttributeTextSettings';
import AttributeNumberSettings from './AttributeNumberSettings';

type AttributeSettingsProps = {

};

const AttributeSettings: React.FunctionComponent<AttributeSettingsProps> = () => {
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

  return (
    <div>

    </div>
  );
};

export default AttributeSettings;
