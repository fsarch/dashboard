'use client';

import React from 'react';
import SearchInput from '@/components/universals/forms/SearchInput.component';
import EmailSortSelect from '@/components/apps/email/EmailSortSelect.component';

const EmailFilters: React.FunctionComponent = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'center' }}>
    <SearchInput placeholder="E-Mails durchsuchen..." ariaLabel="E-Mails durchsuchen" />
    <EmailSortSelect />
  </div>
);

export default EmailFilters;
