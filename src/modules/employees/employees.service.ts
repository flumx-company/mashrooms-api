import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Nullable } from '@mush/core/utils'

import { EmployeesEntity } from './employees.entity'
import { CreateEmployeeDto } from './dto/create.employees.dto'
import { UpdateEmployeeDto } from './dto/update.employees.dto'

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeesEntity)
    private employeesRepository: Repository<EmployeesEntity>,
  ) {}

  findAll(): Promise<EmployeesEntity[]> {
    return this.employeesRepository.find()
  }

  findEmployeeById(id: number): Promise<Nullable<EmployeesEntity>> {
    return this.employeesRepository.findOneBy({ id })
  }

  findEmployeeByPhone(phone: string): Promise<Nullable<EmployeesEntity>> {
    return this.employeesRepository.findOneBy({ phone })
  }

  async createEmployee({
    firstName,
    lastName,
    phone,
  }: CreateEmployeeDto): Promise<EmployeesEntity> {
    const foundEmployeeByPhone = await this.findEmployeeByPhone(phone)

    if (foundEmployeeByPhone) {
      throw new HttpException(
        'An employee with this phone already exists.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const newEmployee: EmployeesEntity = this.employeesRepository.create({
      firstName,
      lastName,
      phone,
    })

    return this.employeesRepository.save(newEmployee)
  }

  async updateEmployee(
    id: number,
    { firstName, lastName, phone }: UpdateEmployeeDto,
  ): Promise<EmployeesEntity> {
    const [foundEmployeeById, foundEmployeeByPhone] = await Promise.all([
      this.findEmployeeById(id),
      this.findEmployeeByPhone(phone),
    ])

    if (!foundEmployeeById) {
      throw new HttpException(
        'An employee with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundEmployeeById && foundEmployeeByPhone.id !== id) {
      throw new HttpException(
        'There already exists a different employee with this phone.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedEmployee: EmployeesEntity = this.employeesRepository.create({
      ...foundEmployeeById,
      firstName,
      lastName,
      phone,
    })

    return this.employeesRepository.save(updatedEmployee)
  }

  async removeEmployee(id: number): Promise<Boolean> {
    const foundEmployee: Nullable<EmployeesEntity> =
      await this.findEmployeeById(id)

    if (!foundEmployee) {
      throw new HttpException(
        'An employee with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    let response = true

    try {
      await this.employeesRepository.remove(foundEmployee)
    } catch (e) {
      response = false
    }

    return response
  }
}
