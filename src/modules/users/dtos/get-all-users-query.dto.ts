// pagination   ->   page,   limit
// sorting      ->   sortField, sortOrder
// filtering    ->   minAge, maxAge, role
// field limiting  ->  fields

import { ApiProperty } from '@nestjs/swagger';
import { UserRoles, SortFields, SortOrder } from '../enums';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsArray,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';

const acceptedFields = [
  'id',
  'name',
  'age',
  'role',
  'password',
  'createdAt',
  'updatedAt',
  'email',
  'image',
];

export class GetAllUsersQueryDto {
  @ApiProperty({
    type: 'number',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiProperty({
    type: 'string',
    enum: SortFields,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortFields)
  sortField?: SortFields;

  @ApiProperty({
    type: 'string',
    enum: SortOrder,
    default: SortOrder.ASC,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @ApiProperty({
    type: 'number',
    required: false,
    minimum: 18,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  minAge?: number;

  @ApiProperty({
    type: 'number',
    required: false,
    minimum: 18,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  maxAge?: number;

  @ApiProperty({
    type: 'string',
    enum: UserRoles,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value?.length) return acceptedFields;
    else {
      const values: string[] = value.split(',');
      const isValid = values.every((el) => acceptedFields.includes(el));
      if (!isValid)
        throw new BadRequestException(`Xato ustun yuborildi: ${value}`);
      return values;
    }
  })
  @IsArray()
  fields?: string[];
}
