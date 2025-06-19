'use client';

import React, { PropsWithChildren } from 'react';
import Button from "@/components/universals/forms/Button";
import { useFormikContext } from "formik";
import InlineLoadingWrapper from "@/components/universals/forms/button/InlineLoadingWrapper";

type FormikSubmitButtonProps = PropsWithChildren<{

}>;

const FormikSubmitButton: React.FunctionComponent<FormikSubmitButtonProps> = ({
  children,
}) => {
  const { isSubmitting } = useFormikContext();

  return (
    <InlineLoadingWrapper isLoading={isSubmitting}>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {children}
      </Button>
    </InlineLoadingWrapper>
  );
};

export default FormikSubmitButton;
