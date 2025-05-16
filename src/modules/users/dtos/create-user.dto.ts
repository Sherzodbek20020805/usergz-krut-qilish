import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../enums';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    example: 'tom',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
    example: 18,
    minimum: 18,
    required: true,
  })
  @IsInt()
  @IsPositive()
  @Min(18)
  age: number;

  @ApiProperty({
    type: 'string',
    example: 'tom@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'tom123',
    minLength: 4,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    type: 'string',
    enum: UserRoles,
    default: UserRoles.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;
}
