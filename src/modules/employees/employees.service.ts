import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Nullable } from "src/core/utils/types";
import { EmployeesEntity } from "./employees.entity";
import { CreateEmployeeDto } from "./dto/create.employees.dto";
import { UpdateEmployeeDto } from "./dto/update.employees.dto";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeesEntity)
    private employeesRepository: Repository<EmployeesEntity>
  ) {}

  findAll(): Promise<EmployeesEntity[]> {
    return this.employeesRepository.find();
  }

  findEmployeeById(id: number): Promise<Nullable<EmployeesEntity>> {
    return this.employeesRepository.findOneBy({ id });
  }

  async createEmployee({
    firstName,
    lastName,
  }: CreateEmployeeDto): Promise<EmployeesEntity> {
    const newEmployee: EmployeesEntity = this.employeesRepository.create({
      firstName,
      lastName,
    });

    return this.employeesRepository.save(newEmployee);
  }

  async updateEmployee({
    id,
    firstName,
    lastName,
  }: UpdateEmployeeDto): Promise<EmployeesEntity> {
    const foundEmployee: Nullable<EmployeesEntity> = await this.findEmployeeById(
      id
    );

    if (!foundEmployee) {
      throw new HttpException(
        "An employee with this id does not exist.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const updatedEmployee: EmployeesEntity = this.employeesRepository.create({
      ...foundEmployee,
      firstName,
      lastName,
    });

    return this.employeesRepository.save(updatedEmployee);
  }

  async removeEmployee(id: number): Promise<Boolean> {
    const foundEmployee: Nullable<EmployeesEntity> = await this.findEmployeeById(
      id
    );

    if (!foundEmployee) {
      throw new HttpException(
        "An employee with this id does not exist.",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    let response = true;

    try {
      await this.employeesRepository.remove(foundEmployee);
    } catch (e) {
      response = false;
    }

    return response;
  }
}
