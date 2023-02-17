import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from './../user-role.enum';
export class UpdateUserDto {
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
