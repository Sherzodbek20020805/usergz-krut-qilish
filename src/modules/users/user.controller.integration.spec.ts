import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FsHelper } from '@helpers';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models';
import { CreateUserDto } from './dtos';

describe('UserController - Integration', () => {
  let controller: UserController;

  beforeAll(async () => {
    const moduleMixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.DB_HOST,
          port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          logging: false,
          sync: {
            alter: true,
          },
          autoLoadModels: true,
        }),
        SequelizeModule.forFeature([User]),
      ],
      controllers: [UserController],
      providers: [UserService, FsHelper],
    }).compile();

    controller = moduleMixture.get<UserController>(UserController);
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await User.sequelize.close();
  });

  it('GET /users -> Get all users', async () => {
    const data: CreateUserDto = {
      age: 10,
      email: 'ali@gmail.com',
      name: 'Ali',
      password: 'ali123',
    };

    await controller.create(data);

    const res = await controller.getAll({});

    expect(res.count).toEqual(1);
  });
});
