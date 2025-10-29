import React from 'react';
import { TSectionView } from "@/components/apps/custom-app/custom-app.type";
import type { TRenderViewsFunc } from "@/components/apps/custom-app/views/View.component";
import Section from "@/components/universals/section/Section";

type SectionViewProps = {
  view: TSectionView;
  dataSource: Record<string, unknown>;
  context?: Record<string, unknown>;
  renderViews: TRenderViewsFunc;
};

export const SectionView: React.FunctionComponent<SectionViewProps> = async ({
  dataSource,
  view,
  renderViews,
  context,
}) => {
  return (
    <Section
      name={view.label}
    >
      {await renderViews(view.views, { dataSource, context })}
    </Section>
  );
};
