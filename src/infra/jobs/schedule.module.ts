import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationTaskUserSchedule } from './notification-task-user.schedule';
import { ITaskUserRepository } from 'src/modules/tasks/repositories/task-user.repository';
import { TaskUserPrismaRepository } from 'src/modules/tasks/repositories/prisma/task-user.prisma.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'NOTIFICATION',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'gp_app_task_manager',
          },
          producer: {
            allowAutoTopicCreation: true,
            retry: {
              retries: 1,
            },
          },
        },
      },
    ]),
  ],
  providers: [
    NotificationTaskUserSchedule,
    {
      provide: ITaskUserRepository,
      useClass: TaskUserPrismaRepository,
    },
  ],
})
export class ScheduleTaskModule {}
