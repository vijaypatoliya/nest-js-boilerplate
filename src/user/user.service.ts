import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as md5 from 'md5';
import * as jwt from 'jwt-then';
const ObjectId = require('mongoose').Types.ObjectId;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /* register user */
  async registerUser(createUser): Promise<User> {

    const orArray = [];
    orArray.push({ userName: { $regex: new RegExp('^' + createUser.userName + '$', 'i') } });
    orArray.push({ emailAddress: { $regex: new RegExp('^' + createUser.emailAddress + '$') } });
    const filter: any = { $or: orArray };

    const salt = '4m0$pr4l3*s0!p3n~d3';
    const userType = 'user';

    const userCheck = await this.userRepository.findOne(filter);
    if (userCheck) throw new HttpException('User already registered!', 400);

    createUser.userType = userType;
    createUser.password_clear = createUser.password;
    createUser.password = md5(createUser.password + salt);

    const newUser = this.userRepository;
    try {
      const user = await newUser.save(createUser);
      return user;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* login user */
  async loginUser(params): Promise<User> {
    if (!params.userName || !params.password) throw new HttpException('Username and password required!', HttpStatus.BAD_REQUEST);
    const salt = '4m0$pr4l3*s0!p3n~d3';
    params.password = md5(params.password + salt);
    let loggedUser = await this.userRepository.findOne(params);

    if (!loggedUser) throw new HttpException('User not found!', HttpStatus.UNAUTHORIZED);

    const JWT = { KEY: 's0!p3n~d34m0$pr4l3*', ALGORITHMS: 'HS256' };
    const token = await jwt.sign({
      id: loggedUser._id,
      user: loggedUser.userName,
      type: loggedUser.userType,
    }, JWT.KEY, {
        algorithm: JWT.ALGORITHMS,
        expiresIn: 60 * 60 * 24,
      });

    if (!token) throw new HttpException('Token could not be created!', HttpStatus.INTERNAL_SERVER_ERROR);

    loggedUser = loggedUser;
    loggedUser.token = token;
    return loggedUser;
  }

  /* user find by id */
  async findOneById(params): Promise<User> {
    const query = {
      _id: new ObjectId(params),
    };
    try {
      const users = await this.userRepository.findOne(query);
      return users;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* check logged */
  async checkLogged(params): Promise<User> {

    try {
      const token = await jwt.verify(params, 's0!p3n~d34m0$pr4l3*');
      const logged = await this.userRepository.findOne({ _id: new ObjectId(token.id) });
      if (!logged) throw new HttpException('Please log in to continue!', HttpStatus.UNAUTHORIZED);
      return logged;
    } catch (e) {
      if (e.name === 'TokenExpiredError') throw new HttpException('Session expired!', HttpStatus.UNAUTHORIZED);
      if (e.name === 'JsonWebTokenError') throw new HttpException('Token wrong or missing!', HttpStatus.UNAUTHORIZED);
      throw new HttpException(e, HttpStatus.UNAUTHORIZED);
    }
  }

  async allUsers(): Promise<User[]> {
    const query = {};
    const users = await this.userRepository.find(query);
    return users;
  }
}