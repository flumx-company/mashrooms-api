import {
  CookieOptions,
  Request as ExRequest,
  Response as ExResponse,
} from 'express'

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { User } from '@mush/modules/core-module/user/user.entity'

import { Auth } from '@mush/core/decorators'
import { EError, EPermission, ERole } from '@mush/core/enums'
import { ApiV1, CError, Nullable, convertType } from '@mush/core/utils'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

type TSameSite = 'lax' | 'strict' | 'none' | boolean
type THttpOnly = boolean | undefined
type TSecure = boolean | undefined
type TPath = string | undefined
type TDomain = string | undefined

@ApiTags('Auth')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('auth'))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getNextDay = () => {
    const nextDay = new Date()
    nextDay.setDate(new Date().getDate() + 1)

    return nextDay
  }

  private setDomainByHost = (hostname:string): void => {
    const token = process.env.COOKIE_TOKEN_DOMAIN || '';
    const listOfDomains = token.indexOf(',') ? token.split(',') : [token];
    const foundDomain = listOfDomains.find(i => i.includes(hostname);
    this.cookieConfig.domain = convertType(foundDomain) as TDomain
  }
  
  private cookieConfig: CookieOptions = {
    httpOnly: convertType(process.env.COOKIE_TOKEN_HTTP_ONLY) as THttpOnly,
    sameSite: process.env.COOKIE_TOKEN_SAME_SITE as TSameSite,
    secure: convertType(process.env.COOKIE_TOKEN_SECURE) as TSecure,
    expires: this.getNextDay(),
    path: convertType(process.env.COOKIE_TOKEN_PATH) as TPath,
    domain: null,
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login by email and password.',
  })
  @ApiBody({
    description: 'Model for Login by email and password.',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'This will return the access token in cookies.',
    type: User,
  })
  async loginByPhoneAndPassword(
    @Req() request: ExRequest,
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) response: ExResponse,
  ): Promise<Nullable<User>> {
    const {
      accessToken,
      user,
    }: {
      accessToken: string
      user: User
    } = await this.authService.login({
      phone: loginData.phone,
      password: loginData.password,
    })

    this.setDomainByHost(request.hostname);
    response.cookie(
      process.env.COOKIE_TOKEN_NAME,
      accessToken,
      this.cookieConfig,
    )

    return user
  }

  @Get('logout')
  @ApiOperation({
    summary: 'Logout.',
  })
  @ApiResponse({
    status: 200,
    description: `This returns "true" if logout was successful`,
    type: Boolean,
  })
  logout(
    @Req() request: ExRequest,
    @Res({ passthrough: true }) response: ExResponse,
  ) {

    this.setDomainByHost(request.hostname);
    
    let hasToken = Boolean(
      request?.['cookies']?.[process.env.COOKIE_TOKEN_NAME],
    )

    if (!hasToken) {
      throw new HttpException(CError.NO_TOKEN, HttpStatus.BAD_REQUEST)
    }

    try {
      response.clearCookie(process.env.COOKIE_TOKEN_NAME, {
        httpOnly: this.cookieConfig.httpOnly,
        secure: this.cookieConfig.secure,
        sameSite: this.cookieConfig.sameSite,
        domain: this.cookieConfig.domain,
      })
      response.end()
    } catch (e) {
      hasToken = false
    }

    return hasToken
  }

  @Get('personal-data')
  @Auth({
    roles: [ERole.SUPERADMIN, ERole.ADMIN],
  })
  @ApiOperation({
    summary:
      'Returns personal data of the logged-in user. Role: SUPERADMIN, ADMIN.',
  })
  @ApiResponse({
    status: 200,
    description: 'This returns personal data of the logged in user',
    type: User,
  })
  async getPersonalData(@Req() request: ExRequest): Promise<User> {
    let userData = request?.['user']

    if (!userData) {
      throw new HttpException(CError.NOT_LOGGED_IN, HttpStatus.BAD_REQUEST)
    }

    return userData
  }

  @Get('permissions')
  @Auth({
    roles: [ERole.SUPERADMIN],
  })
  @ApiOperation({
    summary: 'Returns list of all existing permissions. Role: SUPERADMIN.',
  })
  @ApiResponse({
    status: 200,
    description: 'This returns list of all existing permissions',
    type: Array,
  })
  getPermissions(): EPermission[] {
    return Object.values(EPermission)
  }
}
