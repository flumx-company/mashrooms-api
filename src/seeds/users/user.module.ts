import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersEntity } from '@mush/users/users.entity'

import { UserSeederService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UserSeederService],
  controllers: [UserSeederService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
