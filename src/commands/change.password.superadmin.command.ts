import { InjectRepository } from "@nestjs/typeorm";
import { Command, CommandRunner, Option } from "nest-commander";
import { Repository } from "typeorm";
import { genSalt, hash } from "bcrypt";

import { UsersEntity } from "../modules/core-module/users/users.entity";
import {
  lowerCharList,
  upperCharList,
  numberList,
  symbolList,
} from "src/core/utils/password.characters";
import {
  getRandomInteger,
  getRandomArrayItem,
} from "src/core/utils/get.random";

const generatePassword = () => {
  const minLength: number = 8;
  const maxLength: number = 12;
  const passwordLength: number = getRandomInteger({
    min: minLength,
    max: maxLength,
  });
  const maxUpCharNumber: number = passwordLength - 3;
  const upChartNumber: number = getRandomInteger({
    min: 1,
    max: maxUpCharNumber,
  });
  const maxNumNumber: number = passwordLength - (upChartNumber + 2);
  const numNumber: number = getRandomInteger({
    min: 1,
    max: maxNumNumber,
  });
  const maxSymbolNumber: number =
    passwordLength - (upChartNumber + numNumber + 1);
  const symbolNumber: number = getRandomInteger({
    min: 1,
    max: maxSymbolNumber,
  });
  const lowCharNumber: number =
    passwordLength - (upChartNumber + numNumber + symbolNumber);
  let finalCharacters: string = "";

  for (let i = 0; i < upChartNumber; i++) {
    finalCharacters = finalCharacters.concat(getRandomArrayItem(upperCharList));
  }
  for (let i = 0; i < numNumber; i++) {
    finalCharacters = finalCharacters.concat(getRandomArrayItem(numberList));
  }
  for (let i = 0; i < symbolNumber; i++) {
    finalCharacters = finalCharacters.concat(getRandomArrayItem(symbolList));
  }
  for (let i = 0; i < lowCharNumber; i++) {
    finalCharacters = finalCharacters.concat(getRandomArrayItem(lowerCharList));
  }

  return finalCharacters
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

interface ChangePasswordSuperadminCommandOptions {
  email?: string;
}

@Command({
  name: "changePasswordSuperAdmin",
  description: "Changes superadmin password.",
})
export class ChangePasswordSuperadminCommand extends CommandRunner {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) {
    super();
  }

  async run(
    _: string[],
    options?: ChangePasswordSuperadminCommandOptions
  ): Promise<void> {
    const { email }: ChangePasswordSuperadminCommandOptions = options;
    const foundUserByEmail = await this.usersRepository.findOneBy({ email });

    if (!foundUserByEmail) {
      console.error("A user with this email is not found in our database.");
      return;
    }

    try {
      const newPassword = generatePassword();
      const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);
      const salt = await genSalt(saltRounds);
      const hashedPassword: string = await hash(newPassword, salt);
      const newUser: UsersEntity = this.usersRepository.create({
        ...foundUserByEmail,
        password: hashedPassword,
      });

      await this.usersRepository.save(newUser);
      console.log(
        `Superadmin's password with ${email} was changed to ${newPassword}.`
      );
      console.log(newPassword);
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
}
