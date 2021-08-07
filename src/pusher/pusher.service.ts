import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as Pusher from 'pusher';
import pusherConfig from 'src/_config/pusher.config';
import { PusherSocketManager } from './pusher-socket-manager';

@Injectable()
export class PusherService {
  #pusher;

  constructor(
    @Inject(pusherConfig.KEY)
    private readonly config: ConfigType<typeof pusherConfig>,
    private readonly pusherSocketManager: PusherSocketManager,
  ) {
    this.#pusher = new Pusher({
      appId: config.appId,
      key: config.key,
      secret: config.secret,
      cluster: config.cluster,
      useTLS: config.useTLS,
    });
  }

  auth(socketId, channelName, payload) {
    const auth = this.#pusher.authenticate(socketId, channelName);

    this.pusherSocketManager.create({
      username: payload.username,
      role: payload.role,
      socketId,
    });

    return auth;
  }

  broadcastTo(event) {}
}
