'use client';

import React, { PropsWithChildren } from 'react';
import Button from "@/components/universals/forms/Button";
import { useFormikContext } from "formik";
import Loader from "@/components/universals/loader/Loader";
import styles from './FormikSubmitButton.module.scss';

type FormikSubmitButtonProps = PropsWithChildren<{

}>;

const FormikSubmitButton: React.FunctionComponent<FormikSubmitButtonProps> = ({
  children,
}) => {
  const { isSubmitting } = useFormikContext();

  return (
    <div className={styles.root}>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {children}
      </Button>
      {isSubmitting && (
        <div className={styles.loader}>
          <Loader
            size={32}
          />
        </div>
      )}
    </div>
  );
};

export default FormikSubmitButton;
