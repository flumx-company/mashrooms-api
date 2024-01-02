import { InjectRepository } from "@nestjs/typeorm";
import { Command, CommandRunner, Option } from "nest-commander";
import { Repository } from "typeorm";
import { genSalt, hash } from "bcrypt";

import { UsersEntity } from "../modules/core-module/users/users.entity";
import { EPermission } from "../core/enums/permissions";
import { ERole } from "../core/enums/roles";
import { EPosition } from "src/core/enums/positions";
import { EMAIL_REGEX } from "src/core/utils/regex";

interface CreateSuperadminCommandOptions {
  email?: string;
  password?: string;
}

@Command({
  name: "createSuperAdmin",
  description:
    "Creates superadmin with the following parameters unless a user with this email already exists.",
})
export class CreateSuperadminCommand extends CommandRunner {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) {
    super();
  }

  async run(
    _: string[],
    options?: CreateSuperadminCommandOptions
  ): Promise<void> {
    const { email, password }: CreateSuperadminCommandOptions = options;
    const foundUserByEmail: UsersEntity = await this.usersRepository.findOneBy({
      email,
    });

    if(!EMAIL_REGEX.test(email)) {
      console.error("The input email is not valid.");
      return;
    }

    if (foundUserByEmail) {
      console.error("A user with this email already exists in our database.");
      return;
    }

    try {
      const saltRounds: number = parseInt(process.env.PASSWORD_SALT_ROUNDS);
      const salt: string = await genSalt(saltRounds);
      const hashedPassword: string = await hash(password, salt);
      const newUser: UsersEntity = this.usersRepository.create({
        email,
        password: hashedPassword,
        role: ERole.SUPERADMIN,
        position: EPosition.SUPERADMINISTRATOR,
        permissions: Object.values(EPermission),
      });

      await this.usersRepository.save(newUser);
      console.log("A superadmin user is saved in the database.");
    } catch (error) {
      console.error(error);
    }

    return;
  }

  @Option({
    flags: "-e, --email [email]",
    description: "An email return",
  })
  parseEmail(email: string): string {
    return email;
  }

  @Option({
    flags: "-p, --password [password]",
    description: "A password return",
  })
  parsePassword(password: string): string {
    return password;
  }
}
