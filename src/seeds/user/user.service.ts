import { genSalt, hash } from 'bcrypt'
import { Repository } from 'typeorm'

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from '@mush/modules/core-module/user/user.entity'

import { userList } from './user.data'

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(): Array<Promise<User>> {
    return userList.map(async (user: Partial<User>) => {
      const foundUserByEmail = await this.userRepository.findOneBy({
        email: user.email,
      })

      const foundUserByPhone = await this.userRepository.findOneBy({
        phone: user.phone,
      })

      if (foundUserByEmail) {
        console.log('A user with this email already exists.')
        return Promise.resolve(null)
      }

      if (foundUserByPhone) {
        console.log('A user with this phone number already exists.')
        return Promise.resolve(null)
      }

      try {
        const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)
        const salt = await genSalt(saltRounds)
        const hashedPassword: string = await hash(user.password, salt)
        const newUser: User = this.userRepository.create({
          ...user,
          password: hashedPassword,
        })

        return Promise.resolve(await this.userRepository.save(newUser))
      } catch (error) {
        return Promise.reject(error)
      }
    })
  }
}
