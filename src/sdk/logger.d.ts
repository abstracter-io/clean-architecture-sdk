type LoggerProperties = Record<string, unknown>;

type LogMethod = (message: string | Error, properties?: LoggerProperties) => void;

interface Logger {
  fatal: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  info: LogMethod;
  debug: LogMethod;
  trace: LogMethod;
  child: (properties?: LoggerProperties) => Logger;
}

export { Logger, LogMethod, LoggerProperties };
