import React from 'react';
import { TIframeView } from "@/components/apps/custom-app/custom-app.type";
import { createEvaluableExpression } from "@/components/apps/custom-app/custom-app.utils";
import styles from './IframeView.module.scss';

type IframeViewProps = {
  view: TIframeView;
  dataSource: Record<string, unknown>;
};

const IframeView: React.FunctionComponent<IframeViewProps> = async ({
  view,
}) => {
  const url = await createEvaluableExpression(view.url)({

  });

  return (
    <iframe
      src={url}
      className={styles.root}
    />
  );
};

export default IframeView;
