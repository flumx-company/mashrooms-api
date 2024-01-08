import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { genSalt, hash } from 'bcrypt'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'

import { ERole, EPermission } from '@mush/enums'
import { Nullable } from '@mush/utils'

import { UsersEntity } from './users.entity'
import { CreateUserDto } from './dto/create.user.dto'
import { UpdateUserDto } from './dto/update.user.dto'
import { usersPaginationConfig } from './pagination/users.pagination.config'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<UsersEntity>> {
    return paginate(query, this.usersRepository, usersPaginationConfig)
  }

  findUserById(id: number): Promise<Nullable<UsersEntity>> {
    return this.usersRepository.findOneBy({ id })
  }

  findUserByEmail(email: string): Promise<Nullable<UsersEntity>> {
    return this.usersRepository.findOneBy({ email })
  }

  findUserByPhone(phone: string): Promise<Nullable<UsersEntity>> {
    return this.usersRepository.findOneBy({ phone })
  }

  async createUser({
    email,
    phone,
    firstName,
    lastName,
    password,
    permissions,
    isActive,
  }: CreateUserDto): Promise<UsersEntity> {
    const [foundUserByEmail, foundUserByPhone]: Nullable<UsersEntity>[] =
      await Promise.all([
        this.findUserByEmail(email),
        this.findUserByPhone(phone),
      ])

    if (foundUserByEmail) {
      throw new HttpException(
        'A user with this email already exists.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundUserByPhone) {
      throw new HttpException(
        'A user with this phone already exists.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)
    const salt = await genSalt(saltRounds)
    const hashedPassword: string = await hash(password, salt)
    const newUser: UsersEntity = this.usersRepository.create({
      email,
      phone,
      firstName,
      lastName,
      password: hashedPassword,
      role: ERole.ADMIN,
      permissions,
      isActive,
    })

    return this.usersRepository.save(newUser)
  }

  async updateUser(
    id: number,
    { email, phone, firstName, lastName }: UpdateUserDto,
  ): Promise<UsersEntity> {
    const [
      foundUserById,
      foundUserByEmail,
      foundUserByPhone,
    ]: Nullable<UsersEntity>[] = await Promise.all([
      this.findUserByEmail(email),
      this.findUserByPhone(phone),
      this.findUserById(id),
    ])

    if (foundUserByEmail && foundUserByEmail.id !== id) {
      throw new HttpException(
        'There already exists a different user with this email.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundUserByPhone && foundUserByPhone.id !== id) {
      throw new HttpException(
        'There already exists a different user with this phone.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (!foundUserById) {
      throw new HttpException(
        'A user with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundUserById.role === ERole.SUPERADMIN) {
      throw new HttpException(
        "Superadmin's data cannot be changed through this endpoint.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedUser: UsersEntity = this.usersRepository.create({
      ...foundUserById,
      email,
      phone,
      firstName,
      lastName,
    })

    return this.usersRepository.save(updatedUser)
  }

  async changeUserPassword(id: number, password: string): Promise<UsersEntity> {
    const foundUser: Nullable<UsersEntity> = await this.findUserById(id)

    if (!foundUser) {
      throw new HttpException(
        'A user with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        "Superadmin's password cannot be changed through this endpoint.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)
    const salt = await genSalt(saltRounds)
    const hashedPassword: string = await hash(password, salt)
    const updatedUser: UsersEntity = this.usersRepository.create({
      ...foundUser,
      password: hashedPassword,
    })

    return this.usersRepository.save(updatedUser)
  }

  async removeUser(id: number): Promise<Boolean> {
    const foundUser: Nullable<UsersEntity> = await this.findUserById(id)

    if (!foundUser) {
      throw new HttpException(
        'A user with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        'Superadmin cannot be removed through this endpoint.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    try {
      await this.usersRepository.remove(foundUser)
      return true
    } catch (e) {
      return false
    }
  }

  async getUserPermissions(id: number): Promise<EPermission[]> {
    const foundUser: UsersEntity = await this.findUserById(id)

    if (!foundUser) {
      throw new HttpException(
        'A user with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    return foundUser.permissions
  }

  async updateUserPermissions(
    id: number,
    permissions: EPermission[],
  ): Promise<UsersEntity> {
    const foundUser: UsersEntity = await this.findUserById(id)

    if (!foundUser) {
      throw new HttpException(
        'A user with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        "Superadmin's data cannot be changed through this endpoint.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedUser: UsersEntity = this.usersRepository.create({
      ...foundUser,
      permissions,
    })

    return this.usersRepository.save(updatedUser)
  }

  async updateUserActiveStatus(
    id: number,
    isActive: boolean,
  ): Promise<UsersEntity> {
    const foundUser: Nullable<UsersEntity> = await this.findUserById(id)

    if (!foundUser) {
      throw new HttpException(
        'A user with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        "Superadmin's active status cannot be changed through this endpoint.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedUser: UsersEntity = this.usersRepository.create({
      ...foundUser,
      isActive,
    })

    return this.usersRepository.save(updatedUser)
  }
}
