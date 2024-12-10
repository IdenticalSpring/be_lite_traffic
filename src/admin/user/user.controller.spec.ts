import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserController } from './user.controller';
import { UserService } from 'src/models/user/user.service'; 
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserResponseDto } from 'src/models/user/dto/user-response.dto'; 
import { User, UserRole } from 'src/models/user/entity/user.entity';

describe('AdminUserController', () => {
    let controller: AdminUserController;
    let userService: UserService;

    const mockUserResponse: UserResponseDto = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        avatar: 'avatar_url',
        role: UserRole.USER,
        dateOfBirth: new Date('1990-01-01'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: '123 Street',
    };

    const mockUserService = {
        findOne: jest.fn().mockResolvedValue(mockUserResponse),
        update: jest.fn().mockResolvedValue(mockUserResponse),
        getAllUsers: jest.fn().mockResolvedValue({
            data: [mockUserResponse],
            totalCount: 1,
            currentPage: 1,
            totalPages: 1,
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminUserController],
            providers: [
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        controller = module.get<AdminUserController>(AdminUserController);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get user by ID', async () => {
        const result = await controller.findOne(1);
        expect(result).toEqual(mockUserResponse);
        expect(userService.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw error if user not found', async () => {
        jest.spyOn(userService, 'findOne').mockResolvedValue(null);
        await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should update user by ID', async () => {
        const result = await controller.update(1, {}, null);
        expect(result).toEqual(mockUserResponse);
        expect(userService.update).toHaveBeenCalledWith(1, {}, null);
    });

    it('should get all users with pagination', async () => {
        const result = await controller.findAll(1);
        expect(result).toEqual({
            data: [mockUserResponse],
            totalCount: 1,
            currentPage: 1,
            totalPages: 1,
        });
        expect(userService.getAllUsers).toHaveBeenCalledWith(1);
    });
});
