export class CalendarApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'CalendarApiError';
    this.status = status;
  }
}
