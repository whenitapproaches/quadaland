import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

import { promisify } from 'util';
import { ROOT_PATH } from '_root-path';

const unlink = promisify(fs.unlink);

@Injectable()
export class StoragesService {
  constructor() {}

  async removeFile(mediaPath: string) {
    return unlink(path.resolve(ROOT_PATH, mediaPath));
  }
}
