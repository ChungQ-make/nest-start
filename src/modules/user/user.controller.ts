import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { LoginDto, RegisterUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '@/pipe/validation.pipe';

@ApiBearerAuth() // Swagger 的 JWT 验证
@ApiTags('user') // 添加 接口标签 装饰器
@Controller('user')
export class UserController {
  // 创建 UserController 控制器实例
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 创建 get 请求路由
  @UseGuards(AuthGuard('jwt'))
  @Get('getUserList')
  // @HttpCode(403)
  getUserList(@Res({ passthrough: true }) _res: Response) {
    // @Res() res: Response

    // 手动变更状态码
    // res.status(HttpStatus.FORBIDDEN);
    // return this.userService.getUserList();

    // 方式二 （抛异常）
    return this.userService.getUserList();
  }

  @ApiBody({
    description: '用户注册',
    type: RegisterUserDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @Post('register')
  async register(@Body() userDto: RegisterUserDto) {
    return await this.userService.register(userDto);
  }

  @Get('findOne')
  findOne(@Body() body: { username: string }) {
    return this.userService.findOne(body.username);
  }

  @ApiBody({
    description: '用户登录',
    type: LoginDto,
  })
  @UsePipes(new ValidationPipe()) // 使用管道验证
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const authRes = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (authRes) {
      switch (authRes.code) {
        case 1:
          return this.authService.certificate(authRes.user);
        case 2:
          return {
            code: 2,
            msg: '账号或密码错误！',
          };

        default:
          return {
            code: 0,
            msg: '该用户未注册！',
          };
      }
    } else {
    }
  }
}
