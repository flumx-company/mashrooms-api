import * as bcrypt from 'bcrypt'

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { User } from '@mush/modules/core-module/user/user.entity'
import { UserService } from '@mush/modules/core-module/user/user.service'

import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: LoginDto): Promise<{ accessToken: string; user: User }> {
    const foundUser: User | null = await this.userService.findUserByEmail(email)

    if (!foundUser) {
      throw new NotFoundException('A user with this email does not exist.')
    }

    const matchPasswords = await bcrypt.compare(password, foundUser.password)

    if (!matchPasswords) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Wrong password',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: 'Wrong password',
        },
      )
    }

    if (!foundUser.isActive) {
      throw new NotFoundException(
        "This user's account is not active. Please contact the superadmin to activate it.",
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

    console.log({ accessToken })

    return {
      accessToken,
      user: foundUser,
    }
  }
}
