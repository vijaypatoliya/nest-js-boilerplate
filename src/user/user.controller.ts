import { Controller, Get, Post, Body, UseInterceptors, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiModelProperty, ApiImplicitBody, ApiImplicitHeader } from '@nestjs/swagger';
import { Credentials } from './dto/credentials';
import { CreateUserDto } from './dto/create.user';
import { CheckLog } from './dto/checklog';
import { SetHeader } from './dto/setheader';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/login')
  async login(@Body() credentials: Credentials): Promise<User> {
    return this.userService.loginUser(credentials);
  }

  @Post('/register')
  async register(@Body() createUser: CreateUserDto) {
    return this.userService.registerUser(createUser);
  }

  @Post('checkLogged')
  async check(@Body() CheckLog: CheckLog) {
    return this.userService.checkLogged(CheckLog.token);
  }

  @ApiImplicitHeader({ name: 'Authorization' })
  @Post('/all')
  @UseGuards(AuthGuard('jwt'))
  async all() {
    return this.userService.allUsers();
  }
}