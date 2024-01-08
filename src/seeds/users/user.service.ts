import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { hash, genSalt } from 'bcrypt'

import { UsersEntity } from '@mush/modules/core-module/users/users.entity'

import { userList } from './user.data'

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  create(): Array<Promise<UsersEntity>> {
    return userList.map(async (user: Partial<UsersEntity>) => {
      const foundUser = await this.usersRepository.findOneBy({
        email: user.email,
      })

      if (foundUser) {
        console.log('A user with this email already exists.')
        return Promise.resolve(null)
      }

      try {
        const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)
        const salt = await genSalt(saltRounds)
        const hashedPassword: string = await hash(user.password, salt)
        const newUser: UsersEntity = this.usersRepository.create({
          ...user,
          password: hashedPassword,
        })

        return Promise.resolve(await this.usersRepository.save(newUser))
      } catch (error) {
        return Promise.reject(error)
      }
    })
  }
}
