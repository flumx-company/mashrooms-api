import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Nullable } from '@mush/core/utils'

import { CreateEmployeeDto } from './dto/create.employee.dto'
import { UpdateEmployeeDto } from './dto/update.employee.dto'
import { Employee } from './employee.entity'

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  findAll(): Promise<Employee[]> {
    return this.employeeRepository.find()
  }

  findEmployeeById(id: number): Promise<Nullable<Employee>> {
    return this.employeeRepository.findOneBy({ id })
  }

  findEmployeeByPhone(phone: string): Promise<Nullable<Employee>> {
    return this.employeeRepository.findOneBy({ phone })
  }

  async createEmployee({
    firstName,
    lastName,
    phone,
  }: CreateEmployeeDto): Promise<Employee> {
    const foundEmployeeByPhone = await this.findEmployeeByPhone(phone)

    if (foundEmployeeByPhone) {
      throw new HttpException(
        'An employee with this phone already exists.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const newEmployee: Employee = this.employeeRepository.create({
      firstName,
      lastName,
      phone,
    })

    return this.employeeRepository.save(newEmployee)
  }

  async updateEmployee(
    id: number,
    { firstName, lastName, phone }: UpdateEmployeeDto,
  ): Promise<Employee> {
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

    if (foundEmployeeByPhone && foundEmployeeByPhone.id !== id) {
      throw new HttpException(
        'There already exists a different employee with this phone.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedEmployee: Employee = this.employeeRepository.create({
      ...foundEmployeeById,
      firstName,
      lastName,
      phone,
    })

    return this.employeeRepository.save(updatedEmployee)
  }

  async removeEmployee(id: number): Promise<Boolean> {
    const foundEmployee: Nullable<Employee> = await this.findEmployeeById(id)

    if (!foundEmployee) {
      throw new HttpException(
        'An employee with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    let response = true

    try {
      await this.employeeRepository.remove(foundEmployee)
    } catch (e) {
      response = false
    }

    return response
  }
}
