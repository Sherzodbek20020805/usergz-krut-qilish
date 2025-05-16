import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import {
  CreateUserDto,
  GetAllUsersQueryDto,
  UpdateUserDto,
  UpdateUserImageDto,
} from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { Protected, Roles } from '@decorators';
import { UserRoles } from './enums';

@ApiBearerAuth()
@Controller({
  path: 'users',
  version: ['2'],
})
export class UserController {
  constructor(private service: UserService) {}

  @ApiOperation({ summary: 'Barcha userlarni olish' })
  @Get()
  @Version(['1'])
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async getAll(@Query() queries: GetAllUsersQueryDto) {
    return await this.service.getAll(queries);
  }

  @ApiOperation({ summary: 'Barcha userlarni olish' })
  @Get()
  @Version(['2'])
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async getAllv2(@Query() queries: GetAllUsersQueryDto) {
    return await this.service.getAll(queries);
  }

  @ApiOperation({ summary: 'User yaratish' })
  @Post()
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async create(@Body() payload: CreateUserDto) {
    return await this.service.create(payload);
  }

  @ApiOperation({ summary: 'User yangilash' })
  @Patch(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async update(
    @Body() payload: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.service.update(id, payload);
  }

  @ApiOperation({ summary: 'User rasmini yangilash/yaratish' })
  @ApiConsumes('multipart/form-data')
  @Put(':id/image')
  @Protected(true)
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @UseInterceptors(FileInterceptor('image'))
  async updateUserImage(
    @Body() payload: UpdateUserImageDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.service.updateImage(id, { image });
  }

  @ApiOperation({ summary: "User o'chirish" })
  @Delete(':id')
  @Protected(true)
  @Roles([UserRoles.ADMIN])
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
