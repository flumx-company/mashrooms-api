import {
  HttpException,
  NotFoundException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UsersEntity } from '@mush/users/users.entity'
import { UsersService } from '@mush/users/users.service'

import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: LoginDto): Promise<{ accessToken: string; user: UsersEntity }> {
    const foundUser: UsersEntity | null =
      await this.usersService.findUserByEmail(email)

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

    return {
      accessToken,
      user: foundUser,
    }
  }
}
