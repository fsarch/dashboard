function formatDate(date: Date | string): string {
  const dateToFormat = new Date(date);

  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
    .format(dateToFormat);
}

export const datetimeUtils = {
  formatDate,
};
