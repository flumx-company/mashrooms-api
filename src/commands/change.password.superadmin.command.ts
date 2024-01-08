import { InjectRepository } from '@nestjs/typeorm'
import { Command, CommandRunner, Option } from 'nest-commander'
import { Repository } from 'typeorm'
import { genSalt, hash } from 'bcrypt'

import { UsersEntity } from '@mush/users/users.entity'

import { generatePassword } from '@mush/utils'

interface ChangePasswordSuperadminCommandOptions {
  email?: string
}

@Command({
  name: 'changePasswordSuperAdmin',
  description: 'Changes superadmin password.',
})
export class ChangePasswordSuperadminCommand extends CommandRunner {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
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

    const foundUserByEmail = await this.usersRepository.findOneBy({ email })

    if (!foundUserByEmail) {
      console.error('A user with this email is not found in our database.')
      return
    }

    try {
      const newPassword = generatePassword()
      const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS)
      const salt = await genSalt(saltRounds)
      const hashedPassword: string = await hash(newPassword, salt)
      const newUser: UsersEntity = this.usersRepository.create({
        ...foundUserByEmail,
        password: hashedPassword,
      })

      await this.usersRepository.save(newUser)
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
