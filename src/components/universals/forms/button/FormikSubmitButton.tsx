import React, { PropsWithChildren } from 'react';
import Button from "@/components/universals/forms/Button";
import { useFormikContext } from "formik";

type FormikSubmitButtonProps = PropsWithChildren<{
  className?: string;
}>;

const FormikSubmitButton: React.FunctionComponent<FormikSubmitButtonProps> = ({
  children,
  className,
}) => {
  const formikContext = useFormikContext();

  return (
    <Button
      type="submit"
      className={className}
      disabled={formikContext.status?.loadingData?.length > 0}
    >
      {children}
    </Button>
  );
};

export default FormikSubmitButton;
