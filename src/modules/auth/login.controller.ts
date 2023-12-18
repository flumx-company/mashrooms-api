import { Body, Controller, Post, Res, Get } from "@nestjs/common";
import { ApiV1 } from "../../core/utils/versions";
import {
  ApiBadGatewayResponse,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { LoginService } from "./login.service";
import { Response as ExResponse } from "express";

const ACCESS_TOKEN = "access-token";

@ApiTags("Auth")
@ApiBadGatewayResponse({
  status: 502,
  description: "Something went wrong",
})
@Controller(ApiV1("auth"))
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post("login")
  @ApiOperation({
    summary: "Login by username and password.",
  })
  @ApiBody({
    description: "Model for Login by username and password.",
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
    const accessToken = await this.loginService.login({
      username: loginData.username,
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
  logout(@Res({ passthrough: true }) response: ExResponse) {
    let reply = true;

    try {
      response.clearCookie(ACCESS_TOKEN, { httpOnly: true });
    } catch (e) {
      reply = false;
    }
    
    return reply;
  }
}
