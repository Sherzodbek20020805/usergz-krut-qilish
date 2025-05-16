import { FsHelper } from '@helpers';
import * as bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { CreateUserDto, GetAllUsersQueryDto } from './dtos';
import { UserRoles } from './enums';

describe('UserService unit test', () => {
  let service: UserService;
  let userModel: any = {
    findAndCountAll: jest.fn(),
    create: jest.fn(),
  };
  let fsHelper: FsHelper = {
    removeFiles: jest.fn(),
    uploadFile: jest.fn(),
  };

  beforeEach(() => {
    service = new UserService(userModel, fsHelper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('service defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll method', () => {
    userModel.findAndCountAll = jest
      .fn()
      .mockResolvedValue({ count: 1, rows: [] });
    it('getAll test1', async () => {
      const query: GetAllUsersQueryDto = {
        limit: 5,
        page: 1,
      };
      const res = await service.getAll(query);

      expect(res).toBeInstanceOf(Object);
      expect(res.count).toBe(1);
      expect(res.limit).toEqual(5);
      expect(res.page).toEqual(1);
      expect(res.data).toEqual([]);
    });
  });

  it('create', async () => {
    const createUserData: CreateUserDto = {
      age: 22,
      email: 'tomas@gmail.com',
      name: 'tomas',
      password: 'tomas123',
      role: UserRoles.ADMIN,
      //   image: {
      //     buffer: Buffer.from("test"),
      //     mimetype: "image/png",
      //     origi
      //   }
    };

    const passHash = bcrypt.hashSync(createUserData.password);

    userModel.findOne = jest.fn().mockResolvedValue(undefined);

    userModel.create = jest
      .fn()
      .mockResolvedValue({ ...createUserData, password: passHash });

    const res = await service.create({ ...createUserData, password: passHash });

    expect(res.message).toEqual('Yaratildi');
    expect(res.data).toBeInstanceOf(Object);
    expect(res.data.name).toEqual(createUserData.name);
    expect(res.data.email).toEqual(createUserData.email);
    expect(res.data.age).toEqual(createUserData.age);
    expect(res.data.role).toEqual(createUserData.role);
    expect(res.data.password).toBeTruthy();
    expect(res.data.password).toEqual(passHash);
  });
});
