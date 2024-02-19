import * as bcrypt from 'bcrypt'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
      throw new HttpException(CError.NOT_FOUND_PHONE, HttpStatus.BAD_REQUEST)
    }

    if (!foundUser.isActive) {
      throw new HttpException(CError.INACTIVE_USER, HttpStatus.BAD_REQUEST)
    }

    const matchPasswords = await bcrypt.compare(password, foundUser.password)

    if (!matchPasswords) {
      throw new HttpException(CError.WRONG_PASSWORD, HttpStatus.BAD_REQUEST)
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
