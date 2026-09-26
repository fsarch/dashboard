import { useFormikContext } from 'formik';
import type React from 'react';
import AttributeImageSettings from '@/components/apps/product/attribute/create/AttributeImageSettings';
import { AttributeType } from '@/services/product/attribute.const';
import type { AttributeCreateDto } from '@/services/product/attribute.type';
import AttributeJsonSettings from './AttributeJsonSettings';
import AttributeLinkSettings from './AttributeLinkSettings';
import AttributeNumberSettings from './AttributeNumberSettings';
import AttributeTextSettings from './AttributeTextSettings';

type AttributeSettingsProps = {
  catalogId: string;
};

const AttributeSettings: React.FunctionComponent<AttributeSettingsProps> = ({
  catalogId,
}) => {
  const { values } = useFormikContext<AttributeCreateDto>();

  if (values.attributeTypeId === AttributeType.JSON) {
    return <AttributeJsonSettings />;
  }

  if (values.attributeTypeId === AttributeType.TEXT) {
    return <AttributeTextSettings />;
  }

  if (values.attributeTypeId === AttributeType.NUMBER) {
    return <AttributeNumberSettings />;
  }

  if (values.attributeTypeId === AttributeType.LINK) {
    return <AttributeLinkSettings catalogId={catalogId} />;
  }

  if (values.attributeTypeId === AttributeType.IMAGE) {
    return <AttributeImageSettings />;
  }

  return <div></div>;
};

export default AttributeSettings;
