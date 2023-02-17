import { UsersRepository } from './users.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { Users } from './users.entity';
import { CreateUserCredentialsDto } from './dto/create-user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { UserRole } from './user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async getUsers(filterDto: GetUsersFilterDto, user: Users): Promise<Users[]> {
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }
    return this.usersRepository.getUsers(filterDto);
  }

  async createUser(userCredentials: CreateUserCredentialsDto): Promise<object> {
    return this.usersRepository.createUser(userCredentials);
  }

  async getUserById(id: string, user: Users): Promise<Users> {
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }
    const found = await this.usersRepository.findOneBy({ id });

    if (found === null) {
      throw new NotFoundException(`Task with id '${id}' not found`);
    }

    return found;
  }

  async signIn(userCredentials: UserCredentialsDto): Promise<object> {
    const { username, password } = userCredentials;
    const user = await this.usersRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id: user.id, username, role: user.role };
      const accessToken = await this.jwtService.sign(payload);

      return { message: 'Success', accessToken: accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getUserProfile(id: string): Promise<Users> {
    return this.usersRepository.findOneBy({ id });
  }

  async deleteUserById(id: string, user: Users): Promise<object> {
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }
    const result = await this.usersRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return { message: 'Delete success' };
  }

  async updateUser(
    id: string,
    update: UpdateUserDto,
    user: Users,
  ): Promise<Users> {
    const userProfile = await this.getUserById(id, user);

    if (update.role !== userProfile.role) {
      userProfile.role = update.role;
    }

    return this.usersRepository.save(userProfile);
  }
}
