import * as chalk from 'chalk';
import { format } from 'morgan';

const morganFormat = function (tokens, req, res) {
  return [
    chalk.gray(tokens.date(req, res, 'clf')),
    (() => {
      const method = tokens.method(req, res);
      let formatedMethod = method;

      switch (method) {
        case 'GET':
          formatedMethod = chalk.green(method);
          break;
        case 'POST':
          formatedMethod = chalk.yellow(method);
          break;
        case 'PUT':
          formatedMethod = chalk.yellowBright(method);
          break;
        case 'PATCH':
          formatedMethod = chalk.cyan(method);
          break;
        case 'DELETE':
          formatedMethod = chalk.red(method);
          break;
      }

      return formatedMethod;
    })(),
    tokens.url(req, res),
    chalk.blue(tokens.status(req, res)),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
  ].join(' ');
};

export default morganFormat;
