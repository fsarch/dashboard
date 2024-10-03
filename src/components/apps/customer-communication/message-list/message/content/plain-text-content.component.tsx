import React from 'react';

type PlainTextContentProps = {
  value: string;
};

const PlainTextContent: React.FunctionComponent<PlainTextContentProps> = ({
  value,
}) => {
  return (
    <>
      {value}
    </>
  );
};

export default PlainTextContent;
