import {
  CanActivate,
  ExecutionContext,
  Scope,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'

import { UsersService } from './users/users.service'
import { UsersEntity } from './users/users.entity'

@Injectable({ scope: Scope.REQUEST })
export class JwtStrategy implements CanActivate {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const token: string = request?.['cookies']?.['access-token']

    return token
  }

  private async validate(payload: JwtPayload): Promise<UsersEntity> {
    const id: number = parseInt(payload.id)
    const user: UsersEntity = await this.usersService.findUserById(id)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const token: string = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get(process.env.AUTH_TOKEN_SECRET),
      })
      request['user'] = await this.validate(payload)
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }
}
