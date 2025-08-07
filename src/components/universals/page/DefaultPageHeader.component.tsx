import React from 'react';
import Header from "@/components/navigation/Header";

type DefaultPageHeaderProps = {
  className?: string;
  title: string;
};

const DefaultPageHeader: React.FunctionComponent<DefaultPageHeaderProps> = ({
  className,
  title,
}) => {
  return (
    <header className={className}>
      <Header title={title}/>
    </header>
  );
};

export default DefaultPageHeader;
