import pino, { type Logger } from "pino";

export class ServerLogger {
  public static Instance = new ServerLogger();

  private pino: Logger;
  private section: string;

  constructor(section?: string) {
    this.section = section || '';

    this.pino = pino({
      level: 'debug',
      base: undefined,
      timestamp: false,
      messageKey: 'message',
    });
  }

  public log(message: any, ...args: any[]) {
    const context = this.section ?? args.pop();
    const data = args.shift();

    this.pino.info(
      {
        payload: data,
        section: context,
      },
      message
    );
  }

  public error(message: any, ...args: any[]) {
    const context = this.section ?? args.pop();
    const data = args.shift();

    this.pino.error(
      {
        payload: data,
        section: context,
      },
      message
    );
  }

  public warn(message: any, ...args: any[]) {
    const context = this.section ?? args.pop();
    const data = args.shift();

    this.pino.warn(
      {
        payload: data,
        section: context,
      },
      message
    );
  }

  public debug(message: any, ...args: any[]) {
    const context = this.section ?? args.pop();
    const data = args.shift();

    this.pino.debug(
      {
        payload: data,
        section: context,
      },
      message
    );
  }

  public verbose(message: any, ...args: any[]) {
    const context = this.section ?? args.pop();
    const data = args.shift();

    this.pino.trace(
      {
        payload: data,
        section: context,
      },
      message
    );
  }

  public critical(message: any, ...args: any[]) {
    const context = this.section ?? args.pop();
    const data = args.shift();

    this.pino.fatal(
      {
        payload: data,
        section: context,
      },
      message
    );
  }
}
