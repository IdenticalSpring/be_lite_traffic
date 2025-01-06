import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';
import { User } from './models/user/entity/user.entity';
import { Module } from '@nestjs/common';
import { UserModule } from './models/user/user.module';
import { AdminUserModule } from './admin/user/user.module'
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camera } from './models/camera/entity/camera.entity';
import { CameraModule } from './models/camera/camera.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Camera,
      ],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
    }),
    AuthModule,
    UserModule,
    CameraModule,
    // Wedding template
   
    // Cloudinary


    //Module Admin
    AdminUserModule,

  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule { }
