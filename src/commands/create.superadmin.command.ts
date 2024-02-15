import { genSalt, hash } from 'bcrypt'
import { Command, CommandRunner, Option } from 'nest-commander'
import { Repository } from 'typeorm'

import { InjectRepository } from '@nestjs/typeorm'

import { User } from '@mush/modules/core-module/user/user.entity'

import { EPermission, EPosition, ERole } from '@mush/core/enums'
import { PHONE_REGEX, generatePassword } from '@mush/core/utils'

interface CreateSuperadminCommandOptions {
  number?: string
  password?: string
}

@Command({
  name: 'createSuperAdmin',
  description:
    'Creates superadmin with the following parameters unless a user with this phone number already exists.',
})
export class CreateSuperadminCommand extends CommandRunner {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super()
  }

  async run(
    _: string[],
    options?: CreateSuperadminCommandOptions,
  ): Promise<void> {
    const { number, password }: CreateSuperadminCommandOptions = options

    if (!number) {
      console.error('ERROR: Phone number is not provided.')
      return
    }

    const foundUserByPhone: User = await this.userRepository.findOneBy({
      phone: number,
    })

    if (foundUserByPhone) {
      console.error(
        'ERROR: A user with this phone number already exists in our database.',
      )
      return
    }

    if (!PHONE_REGEX.test(number)) {
      console.error(
        `ERROR: Phone number should consist of digits only and be not more than ${process.env.MAX_PHONE_LENGTH} characters of length`,
      )
      return
    }

    if (password.length < parseInt(process.env.MIN_PASSWORD_LENGTH)) {
      console.error(
        `ERROR: Password should not be shorter than ${process.env.MIN_PASSWORD_LENGTH} characters.`,
      )
      return
    }

    if (password.length > parseInt(process.env.MAX_PASSWORD_LENGTH)) {
      console.error(
        `ERROR: Password should not be larger than ${process.env.MAX_PASSWORD_LENGTH} characters.`,
      )
      return
    }

    try {
      const newPassword = password || generatePassword()
      const saltRounds: number = parseInt(process.env.PASSWORD_SALT_ROUNDS)
      const salt: string = await genSalt(saltRounds)
      const hashedPassword: string = await hash(newPassword, salt)
      const newUser: User = this.userRepository.create({
        phone: number,
        password: hashedPassword,
        role: ERole.SUPERADMIN,
        position: EPosition.SUPERADMINISTRATOR,
        permissions: Object.values(EPermission),
        isActive: true,
      })

      await this.userRepository.save(newUser)

      console.log('NOTE: A new superadmin user is saved in the database.')

      if (!password) {
        console.log(
          'NOTE: Since you have not provided a new password, it was automatically generated.',
        )
      }

      console.log(`NOTE: The phone number/login: ${number}.`)
      console.log(`NOTE: The password is ${newPassword}.`)
      console.log(number)
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
