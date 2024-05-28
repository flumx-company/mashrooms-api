import { genSalt, hash } from 'bcrypt'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EPermission, EPosition, ERole } from '@mush/core/enums'
import { CError, Nullable } from '@mush/core/utils'
import { findWrongEnumValue } from '@mush/core/utils/find.wrong.enum.value'

import { CreateUserDto } from './dto/create.user.dto'
import { UpdateSuperadminDto } from './dto/update.superadmin.dto'
import { UpdateUserDto } from './dto/update.user.dto'
import { userPaginationConfig } from './pagination/user.pagination.config'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, userPaginationConfig)
  }

  findUserById(id: number): Promise<Nullable<User>> {
    return this.userRepository.findOneBy({ id })
  }

  findUserByEmail(email: string): Promise<Nullable<User>> {
    return this.userRepository.findOneBy({ email })
  }

  findUserByPhone(phone: string): Promise<Nullable<User>> {
    return this.userRepository.findOneBy({ phone })
  }

  async createUser({
    email,
    phone,
    firstName,
    lastName,
    patronymic,
    password,
    permissions,
    isActive,
    position,
  }: CreateUserDto): Promise<User> {
    const [
      foundUserByEmail,
      foundUserByPhone,
      wrongPermission,
      wrongPosition,
    ]: [Nullable<User>, Nullable<User>, Nullable<string>, Nullable<string>] =
      await Promise.all([
        this.findUserByEmail(email),
        this.findUserByPhone(phone),
        findWrongEnumValue({
          $enum: EPermission,
          value: permissions,
        }),
        findWrongEnumValue({
          $enum: EPosition,
          value: position,
        }),
      ])

    if (foundUserByEmail) {
      throw new HttpException(
        CError.EMAIL_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (foundUserByPhone) {
      throw new HttpException(
        CError.PHONE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (wrongPermission) {
      throw new HttpException(
        `${CError.INVALID_PERMISSION} ${wrongPermission}`,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (wrongPosition) {
      throw new HttpException(
        `${CError.INVALID_POSITION} ${wrongPosition}`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)
    const salt = await genSalt(saltRounds)
    const hashedPassword: string = await hash(password, salt)
    const newUser: User = this.userRepository.create({
      email,
      phone,
      firstName,
      lastName,
      patronymic,
      password: hashedPassword,
      role: ERole.ADMIN,
      permissions,
      isActive,
      position,
    })

    return this.userRepository.save(newUser)
  }

  async updateUser(
    id: number,
    {
      firstName,
      lastName,
      patronymic,
      email,
      phone,
      position,
      permissions,
      isActive,
    }: UpdateUserDto,
  ): Promise<User> {
    const [foundUserById, foundUserByEmail, foundUserByPhone, wrongPosition]: [
      Nullable<User>,
      Nullable<User>,
      Nullable<User>,
      Nullable<string>,
    ] = await Promise.all([
      this.findUserById(id),
      this.findUserByEmail(email),
      this.findUserByPhone(phone),
      findWrongEnumValue({
        $enum: EPosition,
        value: position,
      }),
    ])

    if (!foundUserById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundUserByEmail && foundUserByEmail.id !== id) {
      throw new HttpException(
        CError.EMAIL_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (foundUserByPhone && foundUserByPhone.id !== id) {
      throw new HttpException(
        CError.PHONE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (foundUserById.role === ERole.SUPERADMIN) {
      throw new HttpException(
        CError.ATTEMPT_TO_EDIT_SUPERADMIN,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (wrongPosition) {
      throw new HttpException(
        `${CError.INVALID_POSITION} ${wrongPosition}`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const updatedUser: User = this.userRepository.create({
      ...foundUserById,
      firstName,
      lastName,
      patronymic,
      email,
      phone,
      position,
      permissions,
      isActive,
    })

    return this.userRepository.save(updatedUser)
  }

  async updateSuperadmin(
    id: number,
    { firstName, lastName, patronymic, email, phone }: UpdateSuperadminDto,
  ): Promise<User> {
    const [
      foundUserById,
      foundUserByEmail,
      foundUserByPhone,
    ]: Nullable<User>[] = await Promise.all([
      this.findUserById(id),
      this.findUserByEmail(email),
      this.findUserByPhone(phone),
    ])

    if (foundUserByEmail && foundUserByEmail.id !== id) {
      throw new HttpException(
        CError.EMAIL_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (foundUserByPhone && foundUserByPhone.id !== id) {
      throw new HttpException(
        CError.PHONE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (!foundUserById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundUserById.role !== ERole.SUPERADMIN) {
      throw new HttpException(CError.NOT_SUPERADMIN_ID, HttpStatus.BAD_REQUEST)
    }

    const updatedSuperadmin: User = this.userRepository.create({
      ...foundUserById,
      firstName,
      lastName,
      patronymic,
      email,
      phone,
    })

    return this.userRepository.save(updatedSuperadmin)
  }

  async changeUserPassword(id: number, password: string): Promise<User> {
    const foundUser: Nullable<User> = await this.findUserById(id)

    if (!foundUser) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        CError.ATTEMPT_TO_EDIT_SUPERADMIN,
        HttpStatus.BAD_REQUEST,
      )
    }

    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)
    const salt = await genSalt(saltRounds)
    const hashedPassword: string = await hash(password, salt)
    const updatedUser: User = this.userRepository.create({
      ...foundUser,
      password: hashedPassword,
    })

    return this.userRepository.save(updatedUser)
  }

  async removeUser(id: number): Promise<Boolean> {
    const foundUser: Nullable<User> = await this.findUserById(id)

    if (!foundUser) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        CError.ATTEMPT_TO_EDIT_SUPERADMIN,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      await this.userRepository.remove(foundUser)
      return true
    } catch (e) {
      return false
    }
  }

  async getUserPermissions(id: number): Promise<EPermission[]> {
    const foundUser: User = await this.findUserById(id)

    if (!foundUser) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    return foundUser.permissions
  }

  async updateUserPermissions(
    id: number,
    permissions: EPermission[],
  ): Promise<User> {
    const [foundUser, wrongPermission]: [Nullable<User>, Nullable<string>] =
      await Promise.all([
        this.findUserById(id),
        findWrongEnumValue({
          $enum: EPermission,
          value: permissions,
        }),
      ])

    if (!foundUser) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        CError.ATTEMPT_TO_EDIT_SUPERADMIN,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (wrongPermission) {
      throw new HttpException(
        `${CError.INVALID_PERMISSION} ${wrongPermission}`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const updatedUser: User = this.userRepository.create({
      ...foundUser,
      permissions,
    })

    return this.userRepository.save(updatedUser)
  }

  async updateUserActiveStatus(id: number, isActive: boolean): Promise<User> {
    const foundUser: Nullable<User> = await this.findUserById(id)

    if (!foundUser) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        CError.ATTEMPT_TO_EDIT_SUPERADMIN,
        HttpStatus.BAD_REQUEST,
      )
    }

    const updatedUser: User = this.userRepository.create({
      ...foundUser,
      isActive,
    })

    return this.userRepository.save(updatedUser)
  }
}
