import { JwtPayload } from '@app/common/types/JwtPayload';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthResponseDto } from 'apps/auth-service/src/dto/auth-response.dto';
import { LoginUserDto } from 'apps/auth-service/src/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../auth-service/src/dto/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersServiceService {
  private SALT = 10;
  private adminSecret: string;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.adminSecret = configService.get<string>('ADMIN_SECRET', '');
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `User with id ${id} not found`,
      });
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    let role = Role.USER;
    if (createUserDto.email === this.adminSecret) {
      role = Role.ADMIN;
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });

    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    await this.handleEmailUpdate(updateUserDto, user);

    await this.handlePasswordUpdate(updateUserDto, user);

    this.handleAvatarUrlUpdate(updateUserDto, user);

    return await this.usersRepository.save(user);
  }

  private async handleEmailUpdate(updateUserDto: UpdateUserDto, user: User) {
    if (updateUserDto.email) {
      const isEmailExist = await this.isEmailExist(updateUserDto.email);

      if (isEmailExist) {
        throw new RpcException({
          statusCode: HttpStatus.CONFLICT,
          message: `Email ${updateUserDto.email} already exists. Please try again`,
        });
      }

      user.email = updateUserDto.email;
    }
  }

  private async handlePasswordUpdate(updateUserDto: UpdateUserDto, user: User) {
    if (
      (updateUserDto.currentPassword ||
        updateUserDto.newPassword ||
        updateUserDto.confirmNewPassword) &&
      (!updateUserDto.currentPassword ||
        !updateUserDto.newPassword ||
        !updateUserDto.confirmNewPassword)
    ) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Current password, new password and confirm password must be provided together',
      });
    } else if (updateUserDto.newPassword !== updateUserDto.confirmNewPassword) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'New password and confirm password must be matched',
      });
    } else {
      try {
        await this.comparePassword(
          updateUserDto.currentPassword!,
          user.password,
        );
        user.password = await this.hashPassword(updateUserDto.newPassword!);
      } catch (err) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Current password is incorrect',
        });
      }
    }
  }

  private handleAvatarUrlUpdate(updateUserDto: UpdateUserDto, user: User) {
    if (updateUserDto.avatarUrl) {
      user.avatarUrl = updateUserDto.avatarUrl;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.usersRepository.delete(id);
  }

  async validateRegisterCredentials(user: CreateUserDto) {
    const isEmailExist = await this.isEmailExist(user.email);
    if (isEmailExist) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: `Email ${user.email} already exists`,
      });
    }

    const createdUser = await this.createUser(user);

    return await this.generateAuthResponse(createdUser);
  }

  async validateLoginCredentials(loginUserDto: LoginUserDto) {
    const foundUser = await this.usersRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!foundUser) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials. Please try again',
      });
    }

    await this.comparePassword(loginUserDto.password, foundUser.password);

    return await this.generateAuthResponse(foundUser);
  }

  async generateAuthResponse(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.generateAccessToken(payload);
    const { password, ...rest } = user;

    return {
      status: 'SUCCESS',
      message: 'User logged in successfully',
      data: {
        accessToken,
        user: rest,
      },
    } as AuthResponseDto;
  }

  async isEmailExist(email: string) {
    return await this.usersRepository.exists({
      where: { email },
    });
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, this.SALT);
  }

  async comparePassword(password: string, hashedPassword: string) {
    const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatched) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials. Please try again',
      });
    }
  }

  async generateAccessToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload);
  }
}
