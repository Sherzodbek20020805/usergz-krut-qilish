import { GetAllUsersQueryDto } from './dtos';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UsersController', () => {
  let controller: UserController;
  let service: any = {
    getAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(() => {
    controller = new UserController(service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET -> /users', async () => {
    service.getAll = jest.fn().mockResolvedValue({
      count: 1,
      limit: 10,
      page: 1,
      data: [],
    });
    const queries: GetAllUsersQueryDto = {};
    const res = await controller.getAll(queries);

    expect(res.count).toEqual(1);
  });
});
