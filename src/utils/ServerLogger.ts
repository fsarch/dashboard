export class ServerLogger {
  public static Instance = new ServerLogger();

  private section: string;

  constructor(section?: string) {
    this.section = section || '';
  }

  private formatOutput(level: string, message: any, data?: any, section?: string) {
    const output = {
      level,
      section: section || this.section || undefined,
      payload: data === undefined ? null : data,
      message,
      timestamp: new Date().toISOString(),
    };

    // Ausgabe als JSON für strukturierte Logs
    try {
      return JSON.stringify(output);
    } catch (e) {
      // Falls Stringify fehlschlägt, fallback auf einfachere Darstellung
      return `${level.toUpperCase()} ${section || this.section || ''} - ${String(message)}`;
    }
  }

  public log(message: any, ...args: any[]) {
    const context = this.section || (args.length ? args.pop() : undefined);
    const data = args.length ? args.shift() : undefined;

    console.info(this.formatOutput('info', message, data, context));
  }

  public error(message: any, ...args: any[]) {
    const context = this.section || (args.length ? args.pop() : undefined);
    const data = args.length ? args.shift() : undefined;

    console.error(this.formatOutput('error', message, data, context));
  }

  public warn(message: any, ...args: any[]) {
    const context = this.section || (args.length ? args.pop() : undefined);
    const data = args.length ? args.shift() : undefined;

    console.warn(this.formatOutput('warn', message, data, context));
  }

  public debug(message: any, ...args: any[]) {
    const context = this.section || (args.length ? args.pop() : undefined);
    const data = args.length ? args.shift() : undefined;

    // console.debug hat nicht überall eine eigene Farbe, aber ist semantisch passend
    console.debug(this.formatOutput('debug', message, data, context));
  }

  public verbose(message: any, ...args: any[]) {
    const context = this.section || (args.length ? args.pop() : undefined);
    const data = args.length ? args.shift() : undefined;

    // verbose mappt auf trace/debug
    if ((console as any).trace) {
      (console as any).trace(this.formatOutput('trace', message, data, context));
    } else {
      console.debug(this.formatOutput('trace', message, data, context));
    }
  }

  public critical(message: any, ...args: any[]) {
    const context = this.section || (args.length ? args.pop() : undefined);
    const data = args.length ? args.shift() : undefined;

    // critical -> fatal/critical, verwenden wir console.error mit Kennzeichnung
    console.error(this.formatOutput('fatal', message, data, context));
  }
}
