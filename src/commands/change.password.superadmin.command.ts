import { genSalt, hash } from 'bcrypt'
import { Command, CommandRunner, Option } from 'nest-commander'
import { Repository } from 'typeorm'

import { InjectRepository } from '@nestjs/typeorm'

import { User } from '@mush/modules/core-module/user/user.entity'

import { generatePassword } from '@mush/core/utils'

interface ChangePasswordSuperadminCommandOptions {
  number?: string
  password?: string
}

@Command({
  name: 'changePasswordSuperAdmin',
  description: 'Changes superadmin password.',
})
export class ChangePasswordSuperadminCommand extends CommandRunner {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super()
  }

  async run(
    _: string[],
    options?: ChangePasswordSuperadminCommandOptions,
  ): Promise<void> {
    const { number, password, ...etc }: ChangePasswordSuperadminCommandOptions =
      options

    if (!number) {
      console.error('Phone number is not provided.')
      return
    }

    const foundUserByPhone = await this.userRepository.findOneBy({
      phone: number,
    })

    if (!foundUserByPhone) {
      console.error(
        'A user with this phone number is not found in our database.',
      )
      return
    }

    if (!password) {
      console.log(
        'NOTE: You have not provided a new password, so it will be automatically generated.',
      )
    }

    try {
      const newPassword = password || generatePassword()
      const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)
      const salt = await genSalt(saltRounds)
      const hashedPassword: string = await hash(newPassword, salt)
      const newUser: User = this.userRepository.create({
        ...foundUserByPhone,
        password: hashedPassword,
      })

      await this.userRepository.save(newUser)
      console.log(
        `Superadmin's password with phone number ${number} was changed to ${newPassword}.`,
      )
      console.log(newPassword)
    } catch (error) {
      console.error(error)
    }

    return
  }

  @Option({
    flags: '-n, --number [number]',
    description: 'An phone number return',
  })
  parseNumber(number: string): string {
    return number
  }

  @Option({
    flags: '-p, --password [password]',
    description: 'A password return',
  })
  parsePassword(password: string): string {
    return password
  }
}
