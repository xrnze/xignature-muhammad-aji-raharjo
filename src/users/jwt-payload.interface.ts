import { UserRole } from './user-role.enum';

export interface JwtPayload {
  id: string;
  username: string;
  role: UserRole;
}
