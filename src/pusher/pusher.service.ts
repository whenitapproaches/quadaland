import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as Pusher from 'pusher';
import pusherConfig from 'src/_config/pusher.config';

@Injectable()
export class PusherService {
  #pusher;

  constructor(
    @Inject(pusherConfig.KEY)
    private readonly config: ConfigType<typeof pusherConfig>,
  ) {
    this.#pusher = new Pusher({
      appId: config.appId,
      key: config.key,
      secret: config.secret,
      cluster: config.cluster,
      useTLS: config.useTLS,
    });
  }

  auth(socketId, channelName) {
    const auth = this.#pusher.authenticate(socketId, channelName);

    return auth;
  }
}
