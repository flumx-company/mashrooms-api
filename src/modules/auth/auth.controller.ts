import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Req,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiV1 } from "../../core/utils/versions";
import {
  ApiBadGatewayResponse,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { Response as ExResponse, Request as ExRequest } from "express";
import { UsersEntity } from "../core-module/users/users.entity";
import { Auth } from "src/core/decorators/auth.decorator";
import { ERole } from "src/core/enums/roles";
import { EPermission } from "../../core/enums/permissions";

const ACCESS_TOKEN = "access-token";

@ApiTags("Auth")
@ApiBadGatewayResponse({
  status: 502,
  description: "Something went wrong",
})
@Controller(ApiV1("auth"))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({
    summary: "Login by email and password.",
  })
  @ApiBody({
    description: "Model for Login by email and password.",
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: "This will return the access token.",
    type: Boolean,
  })
  async loginByEmailAndPassword(
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) response: ExResponse
  ): Promise<Boolean> {
    const accessToken = await this.authService.login({
      email: loginData.email,
      password: loginData.password,
    });
    let reply = Boolean(accessToken);

    if (reply) {
      try {
        response.cookie(ACCESS_TOKEN, accessToken, { httpOnly: true });
      } catch (e) {
        reply = false;
      }
    }

    return reply;
  }

  @Get("logout")
  @ApiResponse({
    status: 200,
    description: `This returns "true" if logout was successful`,
    type: Boolean,
  })
  logout(
    @Req() request: ExRequest,
    @Res({ passthrough: true }) response: ExResponse
  ) {
    let hasToken = Boolean(request?.["cookies"]?.["access-token"]);

    if (!hasToken) {
      throw new HttpException(
        "There is no token in cookies. Nobody is logged in.",
        HttpStatus.UNAUTHORIZED
      );
    }

    try {
      response.clearCookie(ACCESS_TOKEN, { httpOnly: true });
    } catch (e) {
      hasToken = false;
    }

    return hasToken;
  }

  @Get("personal-data")
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
    permission: EPermission.READ_PERSONAL_DATA,
  })
  @ApiResponse({
    status: 200,
    description: "This returns personal data of the logged in user",
    type: UsersEntity,
  })
  async getPersonalData(@Req() request: ExRequest): Promise<UsersEntity> {
    let userData = request?.["user"];

    if (!userData) {
      throw new HttpException("Nobody is logged in.", HttpStatus.UNAUTHORIZED);
    }

    return userData;
  }

  @Get("permissions")
  @ApiResponse({
    status: 200,
    description: "This returns list of all existing permissions",
    type: Array,
  })
  getPermissions(): EPermission[] {
    return Object.values(EPermission);
  }
}
