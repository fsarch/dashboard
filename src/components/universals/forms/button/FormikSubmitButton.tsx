import { useFormikContext } from 'formik';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import Button from '@/components/universals/forms/Button';

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
