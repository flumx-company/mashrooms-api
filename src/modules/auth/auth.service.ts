import {
  HttpException,
  NotFoundException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { UsersEntity } from "../core-module/users/users.entity";
import { UsersService } from "../core-module/users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login({ username, password }: LoginDto): Promise<string> {
    const foundUser: UsersEntity | null = await this.usersService.findUserByUsername(
      username
    );

    if (!foundUser) {
      throw new NotFoundException("A user with this username does not exist.");
    }

    const matchPasswords = await bcrypt.compare(password, foundUser.password);

    if (!matchPasswords) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: "Wrong password",
        },
        HttpStatus.FORBIDDEN,
        {
          cause: "Wrong password",
        }
      );
    }

    return this.jwtService.sign(
      {
        id: foundUser.id,
      },
      {
        expiresIn: process.env.AUTH_TOKEN_EXPIRATION,
      }
    );
  }
}
