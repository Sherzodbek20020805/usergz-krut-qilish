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

export class UpdateUserDto {
  @ApiProperty({
    type: 'string',
    example: 'tom',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
    example: 18,
    minimum: 18,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(18)
  age: number;

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
