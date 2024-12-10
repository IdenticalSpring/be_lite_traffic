import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConflictException, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { SubscriptionPlan, User, UserRole } from 'src/models/user/entity/user.entity';

describe('AuthController', () => {
    let app;
    let authService: AuthService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn(),
                        validateUser: jest.fn(),
                        login: jest.fn(),
                        activateAccount: jest.fn(),
                        resendActivationToken: jest.fn(),
                        forgotPassword: jest.fn(),
                        resetPassword: jest.fn(),
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        authService = module.get<AuthService>(AuthService);
    });

    it('should register a new user successfully', async () => {
        const registerDto: RegisterDto = {
            name: 'John Doe',
            phone: '123456789',
            address: '123 Main Street',
            email: 'johndoe@example.com',
            password: 'password123',
        };

        const mockUser: User = {
            id: 1,
            name: 'John Doe',
            phone: '123456789',
            address: '123 Main Street',
            email: 'johndoe@example.com',
            password: 'password123',
            isActive: true,
            activationToken: 'token123',
            activationTokenExpires: new Date(),
            resetPasswordToken: null,
            resetPasswordExpires: null,
            avatar: null,
            dateOfBirth: null,
            role: UserRole.USER,
            subscriptionPlan: SubscriptionPlan.FREE,
            createdAt: new Date(),
            updatedAt: new Date(),
            templates: [],
        };

        jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(201)
            .expect((res) => {
                const response = res.body;
                response.activationTokenExpires = new Date(response.activationTokenExpires);
                response.createdAt = new Date(response.createdAt);
                response.updatedAt = new Date(response.updatedAt);
                expect(response).toEqual(mockUser);
            });
    });

    it('should throw error if email or phone already exists', async () => {
        const registerDto: RegisterDto = {
            name: 'John Doe',
            phone: '123456789',
            address: '123 Main Street',
            email: 'johndoe@example.com',
            password: 'password123',
        };

        jest.spyOn(authService, 'register').mockRejectedValueOnce(new ConflictException('Email or phone already exists'));

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(409)
            .expect({
                statusCode: 409,
                message: 'Email or phone already exists',
                error: 'Conflict',
            });
    });

    it('should throw error if required fields are missing during registration', async () => {
        const registerDto = {
            name: 'John Doe',
            phone: "",  
            address: '123 Main Street',
            email: 'johndoe@example.com',
            password: 'password123',
        };

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(400) 
    });


    it('should throw error if password is too weak during registration', async () => {
        const registerDto: RegisterDto = {
            name: 'John Doe',
            phone: '123456789',
            address: '123 Main Street',
            email: 'johndoe@example.com',
            password: '1234',  
        };

        await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(400)
            .expect({
                statusCode: 400,
                message: 'Password not strong enough.',
                error: 'Bad Request',
            });
    });

    it('should login user successfully', async () => {
        const loginDto: LoginDto = {
            identifier: 'johndoe@example.com',
            password: 'password123',
        };

        const userMock: User = {
            id: 1,
            name: 'John Doe',
            phone: '123456789',
            address: '123 Main Street',
            email: 'johndoe@example.com',
            password: 'password123',
            isActive: true,
            activationToken: 'token123',
            activationTokenExpires: new Date(),
            resetPasswordToken: null,
            resetPasswordExpires: null,
            avatar: null,
            dateOfBirth: null,
            role: UserRole.USER,
            subscriptionPlan: SubscriptionPlan.FREE,
            createdAt: new Date(),
            updatedAt: new Date(),
            templates: [],
        };

        jest.spyOn(authService, 'validateUser').mockResolvedValue(userMock);
        jest.spyOn(authService, 'login').mockResolvedValue({ access_token: 'jwt-token' });

        await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(201)
            .expect({ access_token: 'jwt-token' });
    });

    it('should throw error if login credentials are invalid', async () => {
        const loginDto: LoginDto = {
            identifier: 'johndoe@example.com',
            password: 'wrongpassword',
        };

        jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

        await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(401)
            .expect({
                statusCode: 401,
                message: 'Invalid credentials',
                error: 'Unauthorized',
            });
    });

    it('should activate account successfully', async () => {
        const token = 'activation-token';

        jest.spyOn(authService, 'activateAccount').mockResolvedValue({ message: 'Account activated successfully' });

        await request(app.getHttpServer())
            .get(`/auth/activate?token=${token}`)
            .expect(200)
            .expect({
                message: 'Account activated successfully',
            });
    });

    it('should throw error if activation token is invalid or expired', async () => {
        const token = 'invalid-token';

        jest.spyOn(authService, 'activateAccount').mockRejectedValue(new BadRequestException('Invalid or expired activation token'));

        await request(app.getHttpServer())
            .get(`/auth/activate?token=${token}`)
            .expect(400)
            .expect({
                statusCode: 400,
                message: 'Invalid or expired activation token',
                error: 'Bad Request',
            });
    });

    it('should resend activation token successfully', async () => {
        const email = 'johndoe@example.com';

        jest.spyOn(authService, 'resendActivationToken').mockResolvedValue({
            message: 'A new activation token has been sent to your email',
        });

        await request(app.getHttpServer())
            .post('/auth/resend-activation-token')
            .send({ email })
            .expect(201)
            .expect({
                message: 'A new activation token has been sent to your email',
            });
    });

    it('should throw error if user not found when resending activation token', async () => {
        const email = 'nonexistent@example.com';

        jest.spyOn(authService, 'resendActivationToken').mockRejectedValue(new BadRequestException('User not found'));

        await request(app.getHttpServer())
            .post('/auth/resend-activation-token')
            .send({ email })
            .expect(400)
            .expect({
                statusCode: 400,
                message: 'User not found',
                error: 'Bad Request',
            });
    });

    it('should reset password successfully', async () => {
        const token = 'reset-token';
        const newPassword = 'newPassword123';

        jest.spyOn(authService, 'resetPassword').mockResolvedValue({ message: 'Password reset successful' });

        await request(app.getHttpServer())
            .post(`/auth/reset-password?token=${token}`)
            .send({ newPassword })
            .expect(201)
            .expect({
                message: 'Password reset successful',
            });
    });

    it('should throw error if reset password token is invalid or expired', async () => {
        const token = 'invalid-token';
        const newPassword = 'newPassword123';

        jest.spyOn(authService, 'resetPassword').mockRejectedValue(new BadRequestException('Invalid or expired token'));

        await request(app.getHttpServer())
            .post(`/auth/reset-password?token=${token}`)
            .send({ newPassword })
            .expect(400)
            .expect({
                statusCode: 400,
                message: 'Invalid or expired token',
                error: 'Bad Request',
            });
    });
});
