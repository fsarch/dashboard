import type React from 'react';
import Header from '@/components/navigation/Header';
import type { TEnvironmentSwitcherConfiguration } from '@/utils/configuration.utils';

type DefaultPageHeaderProps = {
  className?: string;
  title: string;
  // Overrides Header's own (single-service) environment lookup - needed by
  // ServiceSelectionPage, which has no single current service to derive it
  // from, only the app type it's listing instances of.
  environmentSwitcherConfiguration?: TEnvironmentSwitcherConfiguration | null;
};

const DefaultPageHeader: React.FunctionComponent<DefaultPageHeaderProps> = ({
  className,
  title,
  environmentSwitcherConfiguration,
}) => {
  return (
    <header className={className}>
      <Header
        title={title}
        environmentSwitcherConfiguration={environmentSwitcherConfiguration}
      />
    </header>
  );
};

export default DefaultPageHeader;
