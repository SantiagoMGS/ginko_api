/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ArrayNotEmpty,
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidRolesList } from '../enum/valid-roles.enum';
import { ValidRoles } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @ArrayNotEmpty()
  @IsEnum(ValidRolesList, {
    each: true,
    message: `Invalid role. The valid roles are ${ValidRolesList.join(', ')}`,
  })
  roles: ValidRoles[];
}
