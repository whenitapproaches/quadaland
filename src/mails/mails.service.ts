import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import mailConfig from 'src/_config/mail.config';
import * as path from 'path';

@Injectable()
export class MailsService {
  #transporter;
  #config;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof mailConfig>,
  ) {
    this.#config = config;

    this.#transporter = nodemailer.createTransport({
      service: config.service,
      host: config.host,
      port: config.port,
      secure: false,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  sendMail({ template, recipient, subject }, data = {}) {
    ejs.renderFile(
      path.resolve(__dirname, `templates/${template}.mail.ejs`),
      data,
      {},
      async (err, html) => {
        if (err) return;

        let info = await this.#transporter.sendMail({
          from: `"Quadaland" <${this.#config.auth.user}>`,
          to: recipient,
          subject,
          html,
        });
        console.log('Message sent: %s', info.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      },
    );
  }
}
