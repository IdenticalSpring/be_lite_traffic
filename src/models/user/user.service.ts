import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User, UserRole } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import * as cloudinary from 'cloudinary';
import { config } from 'dotenv';
import { UserResponseDto } from './dto/user-response.dto';

config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    data: Partial<User>,
    avatarFile?: Express.Multer.File,
  ): Promise<UserResponseDto> {

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (existingUserByEmail) {
      throw new BadRequestException('Email already exists');
    }

    const existingUserByPhone = await this.userRepository.findOne({
      where: { phone: data.phone },
    });
    if (existingUserByPhone) {
      throw new BadRequestException('Phone number already exists');
    }


    const hashedPassword = await bcrypt.hash(data.password, 10);

    let avatarUrl = null;

    if (avatarFile) {
      avatarUrl = await this.uploadAvatarToCloud(avatarFile); 
    }

    const newUser = this.userRepository.create({
      ...data,
      isActive: data.isActive ?? true,
      password: hashedPassword,
      avatar: avatarUrl, 
    });

    try {

      const savedUser = await this.userRepository.save(newUser);

      return this.mapToUserResponseDto(savedUser);
    } catch (error) {
      this.logger.error('Error creating user: ', error.message);
      throw new BadRequestException(
        'An error occurred while creating the user',
      );
    }
  }

  async findOne(condition: Partial<User>): Promise<User | null> {
    return this.userRepository.findOne({
      // where: condition,
      // // relations: ['orders'],
    });
  }


  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async update(
    id: number,
    data: Partial<User>,
    avatarFile?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.name = data.name || user.name;
    user.email = data.email || user.email;
    // user.phone = data.phone || user.phone;
    // user.isActive = data.isActive ?? user.isActive;
    // user.role = data.role || user.role;

    // if (data.dateOfBirth) {
    //   user.dateOfBirth = new Date(data.dateOfBirth);
    // }

    // Nếu có ảnh avatar, upload lên Cloudinary
    if (avatarFile) {
      user.avatar = await this.uploadAvatarToCloud(avatarFile); 
    }

    await this.userRepository.save(user); 

    return this.mapToUserResponseDto(user); 
  }

  async uploadAvatarToCloud(avatarFile: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {

      if (!avatarFile || !avatarFile.buffer) {
        this.logger.error('Avatar file is missing or invalid');
        reject(new BadRequestException('Avatar file is missing or invalid'));
        return;
      }

      cloudinary.v2.uploader
        .upload_stream(
          { folder: 'eWedding', public_id: avatarFile.originalname }, 
          (error, result) => {
            if (error) {
              this.logger.error('Cloudinary upload error: ' + error.message);
              reject(new BadRequestException('Image upload failed'));
            } else {
              resolve(result.secure_url);
            }
          },
        )
        .end(avatarFile.buffer);
    });
  }

  private mapToUserResponseDto(user: User): UserResponseDto {
    const {
      id,
      name,
      email,
      phone,
      avatar,
      role,
      dateOfBirth,
      isActive,
      createdAt,
      updatedAt,
      address,
    } = user;
    return {
      id,
      name,
      email,
      phone,
      avatar,
      role,
      dateOfBirth,
      isActive,
      createdAt,
      updatedAt,
      address,
    };
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.v2.uploader.destroy(publicId);
    }

    await this.userRepository.delete(id);
  }

  async promoteToAdmin(userId: number): Promise<void> {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = UserRole.ADMIN;
    await this.userRepository.save(user);
  }

  async demoteToUser(userId: number): Promise<void> {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = UserRole.USER;
    await this.userRepository.save(user);
  }

  async searchUsers(
    name: string,
    page: number,
  ): Promise<{
    data: User[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const pageSize = parseInt(process.env.PAGE_SIZE) || 20;

    const [users, totalCount] = await this.userRepository.findAndCount({
      where: name ? { name: Like(`%${name}%`) } : {},
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: users,
      totalCount,
      currentPage: page,
      totalPages,
    };
  }

  async getAllUsers(page: number): Promise<{
    data: User[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const pageSize = parseInt(process.env.PAGE_SIZE) || 20;

    const [users, totalCount] = await this.userRepository.findAndCount({
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: users,
      totalCount,
      currentPage: page,
      totalPages,
    };
  }

  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }
}
