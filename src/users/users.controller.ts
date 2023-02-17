import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './users.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserCredentialsDto } from './dto/create-user-credentials.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { GetUser } from './get-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/create')
  async create(
    @Body() createUserCredentialsDto: CreateUserCredentialsDto,
  ): Promise<object> {
    return this.userService.createUser(createUserCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<object> {
    return this.userService.signIn(userCredentialsDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  async getUsers(
    @Body() filterDto: GetUsersFilterDto,
    @GetUser() user: Users,
  ): Promise<Users[]> {
    return this.userService.getUsers(filterDto, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  getUserById(@Param('id') id: string, @GetUser() user: Users): Promise<Users> {
    return this.userService.getUserById(id, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteUserById(
    @Param('id') id: string,
    @GetUser() user: Users,
  ): Promise<object> {
    return this.userService.deleteUserById(id, user);
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard())
  updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
    @GetUser() user: Users,
  ): Promise<Users> {
    return this.userService.updateUser(id, updateDto, user);
  }
}

@Controller('profile')
export class ProfileController {
  constructor(private userService: UsersService) {}

  @Get('')
  @UseGuards(AuthGuard())
  getUserProfile(@GetUser() user: Users): Promise<Users> {
    return this.userService.getUserProfile(user.id);
  }
}
