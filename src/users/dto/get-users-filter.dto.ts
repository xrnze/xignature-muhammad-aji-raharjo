import { IsOptional, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class GetUsersFilterDto {
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  search: string;
}
