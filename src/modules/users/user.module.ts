import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { FsHelper, JwtHelper } from '@helpers';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AuthController, UserController],
  providers: [AuthService, JwtService, JwtHelper, UserService, FsHelper],
})
export class UserModule {}
