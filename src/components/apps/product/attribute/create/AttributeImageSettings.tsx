import type React from 'react';
import Input from '@/components/universals/forms/Input';
import SimpleFieldsetRow from '@/components/universals/forms/SimpleFieldsetRow.component';

type AttributeImageSettingsProps = {};

const AttributeImageSettings: React.FunctionComponent<
  AttributeImageSettingsProps
> = () => {
  return (
    <SimpleFieldsetRow label="ImageServer URL">
      {(id) => <Input id={id} name="imageServerUrl" type="url" required />}
    </SimpleFieldsetRow>
  );
};

export default AttributeImageSettings;
