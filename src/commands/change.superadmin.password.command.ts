import { genSalt, hash } from 'bcrypt'
import { Command, CommandRunner, Option } from 'nest-commander'
import { Repository } from 'typeorm'

import { InjectRepository } from '@nestjs/typeorm'

import { User } from '@mush/modules/core-module/user/user.entity'

import { generatePassword } from '@mush/core/utils'

interface ChangeSuperadminPasswordCommandOptions {
  number?: string
  password?: string
}

@Command({
  name: 'changeSuperAdminPassword',
  description: 'Changes superadmin password.',
})
export class ChangeSuperadminPasswordCommand extends CommandRunner {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super()
  }

  async run(
    _: string[],
    options?: ChangeSuperadminPasswordCommandOptions,
  ): Promise<void> {
    const { number, password, ...etc }: ChangeSuperadminPasswordCommandOptions =
      options

    if (!number) {
      console.error('ERROR: Phone number is not provided.')
      return
    }

    const foundUserByPhone = await this.userRepository.findOneBy({
      phone: number,
    })

    if (!foundUserByPhone) {
      console.error(
        'ERROR: A user with this phone number is not found in our database.',
      )
      return
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

      if (!password) {
        console.log(
          'NOTE: Since you have not provided a new password, it was automatically generated.',
        )
      }
      console.log(
        `NOTE: Superadmin's password with phone number ${number} was changed to ${newPassword}.`,
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
