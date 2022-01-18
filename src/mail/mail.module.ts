import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';


@Module({
    imports: [
        MailerModule.forRootAsync({
          useFactory: () => ({
            transport: process.env.MAIL_HOST,
            defaults: {
            from: '"PolyCovoit" <polycovoit@polycovoit.fr>',
          },
            template: {
              dir: __dirname + '/templates',
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          })
        }),
      ],
  providers: [MailService],
  exports: [MailService], 
})
export class MailModule {}
