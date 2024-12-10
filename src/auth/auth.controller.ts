import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
@ApiTags('Auth')
@Controller('auth')

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Public()
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 409, description: 'Email or phone already exists.' })
    async register(@Body() registerDto: RegisterDto) {
        if (!registerDto.name ||  !registerDto.email || !registerDto.password) {
            throw new BadRequestException('Missing required fields');
        }
        if (registerDto.password.length < 8) {
            throw new BadRequestException('Password not strong enough.');
        }

        return this.authService.register(registerDto);
    }
    @Public() 
    @Post('login')
    @ApiResponse({ status: 200, description: 'Login successful.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async login(@Body() loginDto: LoginDto) {
        const { identifier, password } = loginDto;

        
        const user = await this.authService.validateUser(identifier, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.authService.login(user);
    }
    @Get('profile')
    @ApiBearerAuth('JWT')  
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'Profile fetched successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    getProfile(@Request() req) {
        const user = req.user;
        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;  
    }
    @Get('activate')
    @Public() 
    @ApiResponse({ status: 200, description: 'Account activated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired activation token' })
    async activateAccount(@Query('token') token: string) {
        return this.authService.activateAccount(token);
    }
    @Public() 
    @Post('resend-activation-token')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'johndoe@example.com' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'A new activation token has been sent to your email' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 400, description: 'Account is already activated' })
    async resendActivationToken(@Body('email') email: string) {
        return this.authService.resendActivationToken(email);
    }
    @Public() 
    @Post('forgot-password')
    @ApiResponse({ status: 200, description: 'Reset password email sent' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    format: 'email',
                    example: 'user@example.com',
                    description: 'Email of the user requesting password reset',
                },
            },
        },
    })
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }
    @Public() 
    @Post('reset-password')
    @ApiResponse({ status: 200, description: 'Password reset successful' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                newPassword: {
                    type: 'string',
                    example: 'newPassword123!',
                    description: 'The new password for the user',
                },
            },
        },
    })
    async resetPassword(
        @Query('token') token: string,
        @Body('newPassword') newPassword: string,
    ) {
        return this.authService.resetPassword(token, newPassword);
    }
}
