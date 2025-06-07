'use client';

import React from 'react';
import Checkbox from "@/components/universals/forms/Checkbox";

type BatchExportCheckboxProps = {
  code: string;
};

const BatchExportCheckbox: React.FunctionComponent<BatchExportCheckboxProps> = ({
  code,
}) => {
  return (
    <Checkbox
      name="shortCodes"
      value={code}
    />
  );
};

export default BatchExportCheckbox;
