import { UserRoles } from '@modules';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'ROLES';

export const Roles = (roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
