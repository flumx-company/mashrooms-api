import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { genSalt, hash } from "bcrypt";
import { UsersEntity } from "./users.entity";
import { Nullable } from "src/core/utils/types";
import { AddSuperaminUserDto, CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import { ERole } from "../../../core/enums/roles";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>
  ) {}

  findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  findUserById(id: number): Promise<Nullable<UsersEntity>> {
    return this.usersRepository.findOneBy({ id });
  }

  findUserByUsername(username: string): Promise<Nullable<UsersEntity>> {
    return this.usersRepository.findOneBy({ username });
  }

  async createUser({
    username,
    password,
    permissions,
  }: CreateUserDto): Promise<UsersEntity> {
    const foundUser: Nullable<UsersEntity> = await this.findUserByUsername(
      username
    );

    if (foundUser) {
      throw new HttpException(
        "A user with this username already exists.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const salt = await genSalt(process.env.PASSWORD_SALT);
    const hashedPassword: string = await hash(password, salt);
    const newUser: UsersEntity = this.usersRepository.create({
      username,
      password: hashedPassword,
      role: ERole.ADMIN,
      permissions,
    });

    return this.usersRepository.save(newUser);
  }

  async createSuperadminUser({
    username,
    password,
    permissions,
  }: AddSuperaminUserDto): Promise<UsersEntity> {
    const foundUser: Nullable<UsersEntity> = await this.findUserByUsername(
      username
    );

    if (foundUser) {
      throw new HttpException(
        "A user with this username already exists.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const salt = await genSalt(process.env.PASSWORD_SALT);
    const hashedPassword: string = await hash(password, salt);
    const newUser: UsersEntity = this.usersRepository.create({
      username,
      password: hashedPassword,
      role: ERole.SUPERADMIN,
      permissions,
    });

    return this.usersRepository.save(newUser);
  }

  async updateUser({
    id,
    username,
    permissions,
  }: UpdateUserDto): Promise<UsersEntity> {
    const foundUser: Nullable<UsersEntity> = await this.findUserById(id);
    const foundUserByUsername: Nullable<UsersEntity> = await this.findUserByUsername(
      username
    );

    if (foundUserByUsername && foundUserByUsername.id !== id) {
      throw new HttpException(
        "There already exists a different user with this username.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (!foundUser) {
      throw new HttpException(
        "A user with this id does not exist.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        "Superadmin's data cannot be changed through this endpoint.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const updatedUser: UsersEntity = this.usersRepository.create({
      ...foundUser,
      username,
      permissions,
    });

    return this.usersRepository.save(updatedUser);
  }

  async changeUserPassword({ id, password }): Promise<UsersEntity> {
    const foundUser: Nullable<UsersEntity> = await this.findUserById(id);

    if (!foundUser) {
      throw new HttpException(
        "A user with this id does not exist.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        "Superadmin's password cannot be changed through this endpoint.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const salt = await genSalt(process.env.PASSWORD_SALT);
    const hashedPassword: string = await hash(password, salt);
    const updatedUser: UsersEntity = this.usersRepository.create({
      ...foundUser,
      password: hashedPassword,
    });

    return this.usersRepository.save(updatedUser);
  }

  async removeUser(id: number): Promise<Boolean> {
    const foundUser: Nullable<UsersEntity> = await this.findUserById(id);

    if (!foundUser) {
      throw new HttpException(
        "A user with this id does not exist.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (foundUser.role === ERole.SUPERADMIN) {
      throw new HttpException(
        "Superadmin cannot be removed through this endpoint.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    let response = true;

    try {
      await this.usersRepository.remove(foundUser);
    } catch (e) {
      response = false;
    }

    return response;
  }
}
