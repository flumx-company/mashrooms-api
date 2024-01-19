import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { User } from '@mush/modules/core-module/user/user.entity'
import { Offload } from '@mush/modules/offload/offload.entity'

import { TypeORMConfig } from '@mush/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      envFilePath: ['stack.env'], //NOTE: for dev mode, use .serve.env; for prod mode, use stack.env
    }),
    TypeOrmModule.forRoot({
      ...TypeORMConfig,
      entities: [User, Offload],
    } as TypeOrmModuleOptions),
  ],
})
export class MysqlDatabaseProviderModule {}
