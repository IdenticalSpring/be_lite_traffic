import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/models/user/user.service'; 
import { User } from 'src/models/user/entity/user.entity';
import { AdminUserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [UserService],
  controllers: [AdminUserController],
  exports: [UserService, TypeOrmModule],
})
export class AdminUserModule {}
