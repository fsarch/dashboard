'use client';

import React, { PropsWithChildren } from 'react';
import Button from "@/components/universals/forms/Button";
import { useFormikContext } from "formik";
import InlineLoadingWrapper from "@/components/universals/forms/button/InlineLoadingWrapper";

type FormikSubmitButtonProps = PropsWithChildren<{
  className?: string;
  buttonClassName?: string;
}>;

const FormikSubmitButton: React.FunctionComponent<FormikSubmitButtonProps> = ({
  children,
  className,
  buttonClassName,
}) => {
  const { isSubmitting } = useFormikContext();

  return (
    <InlineLoadingWrapper isLoading={isSubmitting} className={className}>
      <Button
        type="submit"
        className={buttonClassName}
        disabled={isSubmitting}
      >
        {children}
      </Button>
    </InlineLoadingWrapper>
  );
};

export default FormikSubmitButton;
