import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      userData.email = userData.email.toLowerCase().trim();
      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      const userJson = user.toJSON();
      delete userJson.password;
      return {
        ...userJson,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBError(error);
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userModel.findOne({ email }).select('email password id').exec();
    if (!user) throw new UnauthorizedException('Credentials are not valid ( email');
    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credentials are not valid ( password');
    return {
      ...user.toJSON(),
      token: this.getJwtToken({ id: user.id }),
    }

  }
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
  private handleDBError(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`User exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create user - Check server logs`);
  }

}
