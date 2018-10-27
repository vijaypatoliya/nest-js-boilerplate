import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    // private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userRepository.findOne({where: {userName: payload.user}});
    if (user) {
      return user;
    } else {
      return false;
    }
  }
}