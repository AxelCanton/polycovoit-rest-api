import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserDemand(mail: string) {

    await this.mailerService.sendMail({
      to: mail,
      subject: 'Demande de reservation',
      template: "src/mail/templates/demande",
    });
  }

  async sendUserResponse(mail: string) {

    await this.mailerService.sendMail({
      to: mail,
      subject: 'Demande de reservation',
      template: "src/mail/templates/reponse",
    });
  }
}
