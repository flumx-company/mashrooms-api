import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Nullable } from "src/core/utils/types";
import { OffloadsEntity } from "./offloads.entity";
import { UsersEntity } from "../core-module/users/users.entity";
import { UsersService } from "../core-module/users/users.service";

@Injectable()
export class OffloadsService {
  constructor(
    @InjectRepository(OffloadsEntity)
    private offloadsRepository: Repository<OffloadsEntity>,
    private readonly usersService: UsersService
  ) {}

  findAll(): Promise<OffloadsEntity[]> {
    return this.offloadsRepository.find({
      relations: ["user"],
    });
  }

  findOffloadById(id: number): Promise<Nullable<OffloadsEntity>> {
    return this.offloadsRepository.findOneBy({ id });
  }

  async createOffload({
    user,
  }: {
    user: UsersEntity;
  }): Promise<OffloadsEntity> {
    const newOffload: OffloadsEntity = await this.offloadsRepository.create();
    newOffload.user = user;

    return this.offloadsRepository.save(newOffload);
  }

  async removeOffload(id: number): Promise<Boolean> {
    const foundOffload: Nullable<OffloadsEntity> = await this.findOffloadById(
      id
    );

    if (!foundOffload) {
      throw new HttpException(
        "An offload with this id does not exist.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    let response = true;

    try {
      await this.offloadsRepository.remove(foundOffload);
    } catch (e) {
      response = false;
    }

    return response;
  }
}
