import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  UsernameAndEmail,
  UserCreatedDTO,
  CreateUserDTO,
} from '../../dto/user.dto';
import { IUserRepository } from '../user.repository';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByUsernameOrEmail(data: UsernameAndEmail): Promise<UserCreatedDTO> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });
  }

  async save(data: CreateUserDTO): Promise<UserCreatedDTO> {
    return await this.prisma.user.create({
      data,
    });
  }

  async findByUsername(username: string): Promise<UserCreatedDTO> {
    return await this.prisma.user.findFirst({
      where: {
        username,
      },
    });
  }
}