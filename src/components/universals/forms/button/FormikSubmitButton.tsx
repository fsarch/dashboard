import React, { PropsWithChildren } from 'react';
import Button from "@/components/universals/forms/Button";
import { useFormikContext } from "formik";

type FormikSubmitButtonProps = PropsWithChildren<{

}>;

const FormikSubmitButton: React.FunctionComponent<FormikSubmitButtonProps> = ({
  children,
}) => {
  const formikContext = useFormikContext();

  return (
    <Button
      type="submit"
      disabled={formikContext.status?.loadingData?.length > 0}
    >
      {children}
    </Button>
  );
};

export default FormikSubmitButton;
