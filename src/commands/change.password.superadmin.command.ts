import { genSalt, hash } from 'bcrypt'
import { Command, CommandRunner, Option } from 'nest-commander'
import { Repository } from 'typeorm'

import { InjectRepository } from '@nestjs/typeorm'

import { User } from '@mush/modules/core-module/user/user.entity'

import { generatePassword } from '@mush/core/utils'

interface ChangePasswordSuperadminCommandOptions {
  email?: string
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
    const { email }: ChangePasswordSuperadminCommandOptions = options

    if (!email) {
      console.error('Email is not provided.')
      return
    }

    const foundUserByEmail = await this.userRepository.findOneBy({ email })

    if (!foundUserByEmail) {
      console.error('A user with this email is not found in our database.')
      return
    }

    try {
      const newPassword = generatePassword()
      const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)
      const salt = await genSalt(saltRounds)
      const hashedPassword: string = await hash(newPassword, salt)
      const newUser: User = this.userRepository.create({
        ...foundUserByEmail,
        password: hashedPassword,
      })

      await this.userRepository.save(newUser)
      console.log(
        `Superadmin's password with ${email} was changed to ${newPassword}.`,
      )
      console.log(newPassword)
    } catch (error) {
      console.error(error)
    }

    return
  }

  @Option({
    flags: '-e, --email [email]',
    description: 'An email return',
  })
  parseEmail(email: string): string {
    return email
  }
}
