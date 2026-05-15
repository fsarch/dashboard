import React from 'react';
import type { TView } from '@/components/apps/custom-app/custom-app.type';
import type { TGeneratedFormLinkCardInput } from '@/components/universals/forms/generated/GeneratedForm.type';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import LinkCard from '@/components/universals/link-card/LinkCard.component';
import styles from './GeneratedFormLinkCardInput.module.scss';

type GeneratedFormLinkCardInputProps = {
  input: TGeneratedFormLinkCardInput;
};

function renderView(view: TView, key: string): React.ReactNode {
  if (view.$type === 'paragraph') {
    return <p key={key} className={styles.paragraph}>{typeof view.text === 'string' ? view.text : view.text.value}</p>;
  }

  if (view.$type === 'section') {
    return (
      <div key={key} className={styles.section}>
        <div className={styles.sectionLabel}>{view.label}</div>
        <div className={styles.sectionContent}>
          {view.views.map((nestedView, index) => renderView(nestedView, `${key}-${index}`))}
        </div>
      </div>
    );
  }

  if (view.$type === 'view-group') {
    return (
      <div key={key} className={styles.group}>
        {view.views.map((nestedView, index) => renderView(nestedView, `${key}-${index}`))}
      </div>
    );
  }

  return null;
}

const GeneratedFormLinkCardInput: React.FunctionComponent<GeneratedFormLinkCardInputProps> = ({
  input,
}) => {
  return (
    <FieldsetRow
      label={(
        <span>{input.label}</span>
      )}
    >
      <LinkCard href={typeof input.href === 'string' ? input.href : input.href?.value}>
        <div className={styles.content}>
          {input.views.map((view, index) => renderView(view, `${input.id}-${index}`))}
        </div>
      </LinkCard>
    </FieldsetRow>
  );
};

export default GeneratedFormLinkCardInput;

