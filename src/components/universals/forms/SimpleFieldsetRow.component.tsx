import type React from 'react';
import { useId } from 'react';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';

type SimpleFieldsetRowProps = {
  label: React.ReactNode;
  children: (id: string) => React.ReactNode;
};

const SimpleFieldsetRow: React.FunctionComponent<SimpleFieldsetRowProps> = ({
  children,
  label,
}) => {
  const id = useId();

  return (
    <FieldsetRow label={<label htmlFor={id}>{label}</label>}>
      {children(id)}
    </FieldsetRow>
  );
};

export default SimpleFieldsetRow;
