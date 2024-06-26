import { Test } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { CreateUserUseCase } from '../useCases/create-user.usecase';
import { CreateUserSchemaDTO } from '../schemas/create-user.schema';
import { IUserRepository } from '../repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ProfileUserUseCase } from '../useCases/profile-user.usecase';
import { UploadAvatarUserUseCase } from '../useCases/upload-avatar-user.usecase';
import { IStorage } from '../../../infra/providers/storage/storage';
import { randomUUID } from 'crypto';

describe('User Controller', () => {
  let userController: UserController;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [UserController],
      providers: [
        CreateUserUseCase,
        ProfileUserUseCase,
        UploadAvatarUserUseCase,
        {
          provide: IUserRepository,
          useValue: {
            findByUsernameOrEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: IStorage,
          useValue: {
            upload: jest.fn(),
          },
        },
      ],
    }).compile();
    userController = moduleRef.get<UserController>(UserController);
    userRepository = moduleRef.get<IUserRepository>(IUserRepository);
  });

  it('Should be albe to create a new user', async () => {
    const body: CreateUserSchemaDTO = {
      email: 'test@example.com',
      name: 'Name Test',
      password: '123456',
      username: 'username.test',
    };

    jest.spyOn(userRepository, 'save').mockResolvedValue({
      ...body,
      id: randomUUID(),
      createdAt: new Date(),
    });

    const result = await userController.create(body);
    expect(result).toHaveProperty('username');
  });
});
