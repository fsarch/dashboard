import React, { PropsWithChildren } from 'react';

type DialogProps = PropsWithChildren<{

}>;

const Dialog: React.FunctionComponent<DialogProps> = ({
  children,
}) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Dialog;
