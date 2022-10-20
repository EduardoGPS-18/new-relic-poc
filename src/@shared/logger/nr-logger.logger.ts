import pino from 'pino';
import { LoggerService } from '@nestjs/common';
require('newrelic');
import nrPino from '@newrelic/pino-enricher';

export class NrLogger implements LoggerService {
  private static consoleWrite(message, level = 'info', optionalParams: any[]) {
    pino(nrPino())
      .child({ level })
      .info(
        JSON.stringify({
          level: level,
          logType: 'APPLICATION',
          message: message,
          service: 'observability-poc',
          timestamp: new Date()
            .toISOString()
            .replace('T', ' ')
            .replace(/\..*/, ''),
          ...optionalParams.reduce((acc, curr) => {
            if (typeof curr == 'string') {
              return { ...acc, component: curr };
            }
            return { ...acc, ...curr };
          }, {}),
        }),
      );
    return JSON.stringify({
      level: level,
      message: message,
      timestamp: new Date().toISOString().replace('T', ' ').replace(/\..*/, ''),
      ...optionalParams.reduce((acc, curr) => {
        if (typeof curr == 'string') {
          return { ...acc, component: curr };
        }
        return { ...acc, ...curr };
      }, {}),
    });
  }
  log(message: any, ...optionalParams: any[]) {
    console.log(NrLogger.consoleWrite(message, 'info', optionalParams));
  }
  error(message: any, ...optionalParams: any[]) {
    console.error(NrLogger.consoleWrite(message, 'error', optionalParams));
  }
  warn(message: any, ...optionalParams: any[]) {
    console.warn(NrLogger.consoleWrite(message, 'warn', optionalParams));
  }
  debug(message: any, ...optionalParams: any[]) {
    console.debug(NrLogger.consoleWrite(message, 'debug', optionalParams));
  }
}
