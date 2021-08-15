import { Buffer } from 'buffer';

export const encodeBase64 = (data) => {
  const buff = Buffer.from(data);
  return buff.toString('base64');
};

export const decodeBase64 = (data) => {
  const buff = Buffer.from(data, 'base64');
  return buff.toString('ascii');
};
