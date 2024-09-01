import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {

      const user = await this.userModel.create(createUserDto);
      return user;
    } catch (error) {
      this.handleDBError(error);
    };
  }
  private handleDBError(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`User exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create user - Check server logs`);
  }

}
