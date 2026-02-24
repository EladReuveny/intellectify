import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailServiceService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const expirationTime = this.configService.get<string>(
      'JWT_RESET_TOKEN_EXPIRATION',
      '15m',
    );

    const mailFrom = this.configService.get<string>(
      'MAIL_FROM',
      'no-reply@Intellectify.com',
    );

    try {
      await this.transporter.sendMail({
        from: mailFrom,
        to: email,
        subject: 'Password Reset',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You recently requested to reset your password. The link below will expire in <strong>${expirationTime}</strong>.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #3498db; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p>If you did not request this password reset, please ignore this email or contact our support immediately.</p>
            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
          </div>
        `,
      });
    } catch (err) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to send reset password email',
      });
    }
  }

  async sendResetPasswordConfirmationEmail(email: string) {
    const mailFrom = this.configService.get<string>(
      'MAIL_FROM',
      'no-reply@Intellectify.com',
    );

    try {
      await this.transporter.sendMail({
        from: mailFrom,
        to: email,
        subject: 'Password Reset Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50;">Password Reset Successful</h2>
            <p>Hello,</p>
            <p>Your password has been reset successfully. You can now log in with your new password.</p>

            <p>If you did not perform this action, please contact our support immediately.</p>
            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
          </div>
        `,
      });
    } catch (err) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to send reset password confirmation email',
      });
    }
  }
}
