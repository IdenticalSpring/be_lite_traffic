import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { Express } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('JWT')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: number): Promise<UserResponseDto> {
    const user = await this.userService.findOne({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  @Put(':id')
  @Public()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatarFile: Express.Multer.File,
  ): Promise<UserResponseDto> {

    if (avatarFile && !avatarFile.mimetype.startsWith('image/')) {
      throw new Error('Invalid file type for avatar');
    }

    console.log('Avatar file:', avatarFile); 

    const user = await this.userService.update(id, updateUserDto, avatarFile);
    return user;
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserResponseDto],
  })
  async findAll(@Query('page') page: number = 1): Promise<any> {
    const users = await this.userService.getAllUsers(page);
    return users;
  }
}
