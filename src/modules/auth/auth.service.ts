import * as bcrypt from 'bcrypt'

import {
  HttpException,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { User } from '@mush/modules/core-module/user/user.entity'
import { UserService } from '@mush/modules/core-module/user/user.service'

import { EError } from '@mush/core/enums'
import { CError } from '@mush/core/utils'

import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({
    phone,
    password,
  }: LoginDto): Promise<{ accessToken: string; user: User }> {
    const foundUser: User | null = await this.userService.findUserByPhone(phone)

    if (!foundUser) {
      throw new HttpException(
        CError[EError.NOT_FOUND_PHONE],
        EError.NOT_FOUND_PHONE,
      )
    }

    if (!foundUser.isActive) {
      throw new HttpException(
        CError[EError.INACTIVE_USER],
        EError.INACTIVE_USER,
      )
    }

    const matchPasswords = await bcrypt.compare(password, foundUser.password)

    if (!matchPasswords) {
      throw new HttpException(
        CError[EError.WRONG_PASSWORD],
        EError.WRONG_PASSWORD,
      )
    }

    const accessToken = await this.jwtService.sign(
      {
        id: foundUser.id,
      },
      {
        expiresIn: process.env.AUTH_TOKEN_EXPIRATION,
      },
    )

    return {
      accessToken,
      user: foundUser,
    }
  }
}
