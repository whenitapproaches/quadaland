import * as moment from 'moment';
import { MYSQL_DATE_FORMAT } from '../constants';

export const getStartCurrentDate = (format = MYSQL_DATE_FORMAT) => {
  return moment(Date.now()).startOf('day').format('YYYY-MM-DD HH:mm:ss');
};

export const getEndCurrentDate = (format = MYSQL_DATE_FORMAT) => {
  return moment(Date.now()).endOf('day').format('YYYY-MM-DD HH:mm:ss');
};
