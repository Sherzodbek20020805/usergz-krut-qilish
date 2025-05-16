import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from './models';
import {
  CreateUserDto,
  GetAllUsersQueryDto,
  UpdateUserDto,
  UpdateUserImageDto,
} from './dtos';
import { FsHelper } from '@helpers';
import { UserRoles } from './enums';
import { Op } from 'sequelize';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private fsHelper: FsHelper,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async getAll(queries: GetAllUsersQueryDto) {
    let filters: any = {};

    if (queries.minAge) {
      filters.age = {
        [Op.gte]: queries.minAge,
      };
    }

    if (queries.maxAge) {
      filters.age = {
        ...filters?.age,
        [Op.lte]: queries.maxAge,
      };
    }

    if (queries.role) {
      filters.role = {
        [Op.eq]: queries.role,
      };
    }

    const { count, rows: users } = await this.userModel.findAndCountAll({
      limit: queries.limit || 10,
      offset: (queries.page - 1) * queries.limit || 0,
      order: queries.sortField
        ? [[queries.sortField, queries.sortOrder || 'DESC']]
        : null,
      where: { ...filters },
      attributes: queries.fields,
    });
    return {
      count: count,
      limit: queries.limit || 10,
      page: queries.page || 1,
      data: users,
    };
  }

  async create(payload: CreateUserDto) {
    const foundedUser = await this.userModel.findOne({
      where: { email: payload.email },
    });

    if (foundedUser) {
      throw new ConflictException("Bunday email'lik foydalanuvchi bor");
    }

    const passHash = bcrypt.hashSync(payload.password);

    const user = await this.userModel.create({
      email: payload.email,
      name: payload.name,
      age: payload.age,
      password: passHash,
      role: payload.role,
    });

    return {
      message: 'Yaratildi',
      data: user,
    };
  }

  async update(id: number, payload: UpdateUserDto) {
    const foundedUser = await this.userModel.findByPk(id);

    if (!foundedUser) {
      throw new ConflictException('Foydalanuvchi topilmadi');
    }

    const updatedUser = await this.userModel.update(
      {
        name: payload.name,
        age: payload.age,
        role: payload.role,
      },
      { where: { id }, returning: true },
    );

    return {
      message: 'success',
      data: updatedUser,
    };
  }

  async updateImage(id: number, payload: UpdateUserImageDto) {
    const foundedUser = await this.userModel.findByPk(id);

    if (!foundedUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (!payload.image) {
      throw new BadRequestException('Iltimos rasm yuboring');
    }

    if (foundedUser.image) {
      await this.fsHelper.removeFiles(foundedUser.image);
    }

    const image = await this.fsHelper.uploadFile(payload.image);

    await this.userModel.update({ image: image.fileUrl }, { where: { id } });

    return {
      message: 'yangilandi',
    };
  }

  async delete(id: number) {
    const foundedUser = await this.userModel.findByPk(id);

    if (!foundedUser) throw new NotFoundException('Foydalanuvchi topilmadi');

    if (foundedUser.image) {
      await this.fsHelper.removeFiles(foundedUser.image);
    }

    await this.userModel.destroy({ where: { id } });

    return {
      message: "O'chirildi",
      data: foundedUser,
    };
  }

  async seedUsers() {
    const defaultUsers = [
      {
        name: 'Billy',
        age: 25,
        email: 'billy@gmail.com',
        password: 'billy',
        role: UserRoles.ADMIN,
      },
    ];

    for (let user of defaultUsers) {
      const foundedUser = await this.userModel.findOne({
        where: { email: user.email },
      });

      if (!foundedUser) {
        const passHash = bcrypt.hashSync(user.password);
        await this.userModel.create({
          name: user.name,
          role: user.role,
          age: user.age,
          email: user.email,
          password: passHash,
        });
      }
    }

    console.log('Adminlar yaratildi ✅');
  }
}
