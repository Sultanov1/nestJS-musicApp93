import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthGuard } from '@nestjs/passport';
import {Request} from 'express';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    const user = new this.userModel({
      email: registerUserDto.email,
      password: registerUserDto.password,
      displayName: registerUserDto.displayName,
    })

    user.generateToken();

    return user.save();
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(TokenAuthGuard)
  @Get('secret')
  async secret(@Req() req: Request) {
    const user = req.user as UserDocument;
    return {message: 'Secret message', email: user.email}
  }

  @UseGuards(TokenAuthGuard)
  @Delete('logout')
  async logout(@Req() req: Request) {
   const user = req.user as UserDocument;

   user.token = null;
   await user.save();

   return {message: 'Successfully logged out'}
  }
}
