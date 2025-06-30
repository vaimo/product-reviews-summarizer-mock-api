declare module "@adobe/aio-sdk" {
  export namespace Core {
    interface LoggerOptions {
      level?: string;
      [key: string]: any;
    }

    interface LoggerInstance {
      error(message: any): void;
      debug(message: any): void;
      info(message: any, ...args: any[]): void;
    }

    const Logger: {
      (name: string, options?: LoggerOptions): LoggerInstance;
      new (name: string, options?: LoggerOptions): LoggerInstance;
    };
  }
}
