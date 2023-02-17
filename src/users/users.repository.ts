import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateUserCredentialsDto } from './dto/create-user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { Users } from './users.entity';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<Users[]> {
    const { role, search } = filterDto;
    const query = this.createQueryBuilder('users');

    if (role) {
      query.andWhere('users.role = :role', { role });
    }

    if (search) {
      query.andWhere('LOWER(users.username) ILIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }
    const queryStr = query.getQueryAndParameters();
    console.log(queryStr);
    const tasks = await query.getMany();
    return tasks;
  }

  async createUser(
    createUserCredentialsDto: CreateUserCredentialsDto,
  ): Promise<object> {
    const { username, password, role } = createUserCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword, role });

    try {
      await this.save(user);
    } catch (err) {
      console.log(err);
      if (err.code === '23505') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return { message: 'Success' };
  }
}
