import { registerAs } from '@nestjs/config';
import * as moment from 'moment';

import { LoggerOptions, transports, format } from 'winston';
import * as chalk from 'chalk';

const consoleLogFormat = format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    const readableTimestamp = moment(timestamp).format('DD/MM/Y kk:mm:ss.SSSS');

    let logMessage = `${chalk.bgGray(
      readableTimestamp,
    )} [${level}] : ${message} `;
    if (metadata) {
      logMessage += chalk.gray(JSON.stringify(metadata));
    }
    return logMessage;
  },
);

const fileLogFormat = format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    const readableTimestamp = moment(timestamp).format('DD/MM/Y kk:mm:ss.SSSS');

    let logMessage = `${readableTimestamp} [${level}] : ${message} `;
    if (metadata) {
      logMessage += JSON.stringify(metadata);
    }
    return logMessage;
  },
);

export default registerAs(
  'winston',
  (): LoggerOptions => ({
    transports: [
      new transports.Console({
        format: format.combine(format.colorize(), consoleLogFormat),
      }),
      new transports.File({
        filename: './logging/app.log',
        format: format.combine(fileLogFormat, format.ms()),
        level: 'error',
      }),
    ],
    exitOnError: false,
  }),
);
