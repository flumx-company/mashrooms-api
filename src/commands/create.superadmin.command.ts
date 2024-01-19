import { genSalt, hash } from 'bcrypt'
import { Command, CommandRunner, Option } from 'nest-commander'
import { Repository } from 'typeorm'

import { InjectRepository } from '@nestjs/typeorm'

import { User } from '@mush/modules/core-module/user/user.entity'

import { EPermission, EPosition, ERole } from '@mush/core/enums'
import { EMAIL_REGEX } from '@mush/core/utils'

interface CreateSuperadminCommandOptions {
  email?: string
  password?: string
}

@Command({
  name: 'createSuperAdmin',
  description:
    'Creates superadmin with the following parameters unless a user with this email already exists.',
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
    const { email, password }: CreateSuperadminCommandOptions = options
    const foundUserByEmail: User = await this.userRepository.findOneBy({
      email,
    })

    if (!EMAIL_REGEX.test(email)) {
      console.error('The input email is not valid.')
      return
    }

    if (foundUserByEmail) {
      console.error('A user with this email already exists in our database.')
      return
    }

    try {
      const saltRounds: number = parseInt(process.env.PASSWORD_SALT_ROUNDS)
      const salt: string = await genSalt(saltRounds)
      const hashedPassword: string = await hash(password, salt)
      const newUser: User = this.userRepository.create({
        email,
        password: hashedPassword,
        role: ERole.SUPERADMIN,
        position: EPosition.SUPERADMINISTRATOR,
        permissions: Object.values(EPermission),
        isActive: true,
      })

      await this.userRepository.save(newUser)
      console.log('A superadmin user is saved in the database.')
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

  @Option({
    flags: '-p, --password [password]',
    description: 'A password return',
  })
  parsePassword(password: string): string {
    return password
  }
}
