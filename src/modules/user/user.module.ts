import { Module } from '@nestjs/common';
import { UserController } from './presentation';
import { UserService, USER_TOKENS } from './application';
import { InMemoryUserRepository } from './infrastructure';
import { USER_REPOSITORY } from './domain';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_TOKENS.USER_SERVICE,
      useClass: UserService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [USER_TOKENS.USER_SERVICE],
})
export class UserModule {}
