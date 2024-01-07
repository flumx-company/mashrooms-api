import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { JwtStrategy } from './jwt.strategy'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.AUTH_TOKEN_SECRET,
          signOptions: {
            expiresIn: process.env.AUTH_TOKEN_EXPIRATION,
          },
        }
      },
      extraProviders: [ConfigService],
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy, ConfigModule, UsersModule, JwtModule],
})
export class CoreModule {}
