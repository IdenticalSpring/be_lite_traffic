import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service'; 
import { User, UserRole } from '../models/user/entity/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(data: Partial<User>) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email: data.email }, { phone: data.phone }],
      });

      if (existingUser) {
        throw new ConflictException('Email or phone already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const activationToken = this.generateActivationCode(6);
      const tokenExpires = new Date();
      tokenExpires.setHours(tokenExpires.getHours() + 1);

      const user = this.userRepository.create({
        ...data,
        password: hashedPassword,
        activationToken,
        activationTokenExpires: tokenExpires,
        isActive: false,
        role: UserRole.USER,
      });

      const savedUser = await this.userRepository.save(user);

      this.sendActivationEmail(
        savedUser.email,
        activationToken,
        savedUser.name,
      );

      return savedUser;
    } catch (error) {
      console.error('Detailed error in register:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException('Unable to register user');
    }
  }

  private generateActivationCode(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let activationCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      activationCode += chars[randomIndex];
    }
    return activationCode;
  }
  async validateUser(
    identifier: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new BadRequestException('Account is not activated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendActivationEmail(
    email: string,
    activationCode: string,
    name: string,
  ) {
    const subject = 'Activate your account';
    const template = 'activation';
    const context = { name, activationCode };

    try {
      await this.emailService.sendMail(email, subject, template, context);
      console.log(`Activation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending activation email:', error);
      throw new Error('Unable to send activation email');
    }
  }

  async activateAccount(token: string) {
    const user = await this.userRepository.findOne({
      where: { activationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid activation token');
    }

    if (user.activationTokenExpires < new Date()) {
      throw new BadRequestException('Activation token has expired');
    }

    user.isActive = true;
    user.activationToken = null;
    user.activationTokenExpires = null;
    await this.userRepository.save(user);

    return { message: 'Account activated successfully' };
  }
  async resendActivationToken(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
        error: 'Not Found',
      });

    }

    if (user.isActive) {
      throw new BadRequestException('Account is already activated');
    }

    const newActivationToken = crypto.randomBytes(32).toString('hex');
    const newTokenExpires = new Date();
    newTokenExpires.setHours(newTokenExpires.getHours() + 1);

    user.activationToken = newActivationToken;
    user.activationTokenExpires = newTokenExpires;

    await this.userRepository.save(user);

    this.sendActivationEmail(user.email, newActivationToken, user.name);

    return { message: 'A new activation token has been sent to your email' };
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException({
          message: 'User not found',
          statusCode: 404,
          error: 'Not Found',
        });
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const tokenExpires = new Date();
      tokenExpires.setMinutes(tokenExpires.getMinutes() + 5); // Expiry: 5 minutes

      user.resetPasswordToken = resetCode;
      user.resetPasswordExpires = tokenExpires;
      await this.userRepository.save(user);

      await this.emailService.sendMail(
        user.email,
        'Reset Password',
        'reset-password',
        { name: user.name || user.email, resetCode },
      );

      return 'Reset password email sent';
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException
      }

      console.error('Error in forgotPassword:', error.message);
      throw new InternalServerErrorException(
        'Unable to process forgot password request',
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: 'Password reset successful' };
  }

}
