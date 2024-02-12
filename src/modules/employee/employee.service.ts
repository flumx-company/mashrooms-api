import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EFileCategory } from '@mush/core/enums'
import { Nullable } from '@mush/core/utils'

import { FileUploadService } from '../file-upload/file-upload.service'
import { BufferedFile } from '../file-upload/file.model'
import { PublicFile } from '../file-upload/public-file.entity'
import { CreateEmployeeDto } from './dto/create.employee.dto'
import { UpdateEmployeeDto } from './dto/update.employee.dto'
import { Employee } from './employee.entity'

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private readonly fileUploadService: FileUploadService,
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

  async createEmployee(
    {
      firstName,
      lastName,
      patronymic,
      phone,
      bankCard,
      region,
      town,
      isActive,
      isUnreliable,
      hasCriminalRecord,
    }: CreateEmployeeDto,
    files: BufferedFile[],
  ): Promise<Employee> {
    const foundEmployeeByPhone = await this.findEmployeeByPhone(phone)
    let avatarData: PublicFile
    let documentListData: PublicFile[]

    if (foundEmployeeByPhone) {
      throw new HttpException(
        'An employee with this phone already exists.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (files) {
      const avatarFile = files.find(({ fieldname }) => {
        return fieldname === EFileCategory.EMPLOYEE_AVATARS
      })

      const docFiles = files.filter(({ fieldname }) => {
        return fieldname === EFileCategory.EMPLOYEE_DOCUMENTS
      })

      const data = await Promise.all([
        avatarFile ? this.fileUploadService.uploadPublicFile(avatarFile) : null,
        docFiles ? this.fileUploadService.uploadPublicFiles(docFiles) : null,
      ])

      avatarData = data[0]
      documentListData = data[1]
    }

    const newEmployee: Employee = this.employeeRepository.create({
      firstName,
      lastName,
      patronymic,
      phone,
      bankCard,
      region,
      town,
      isActive,
      isUnreliable,
      hasCriminalRecord,
      avatars: avatarData ? [avatarData] : [],
      documents: documentListData || [],
    })

    return this.employeeRepository.save(newEmployee)
  }

  async updateEmployee(
    id: number,
    {
      firstName,
      lastName,
      patronymic,
      phone,
      bankCard,
      region,
      town,
      isActive,
      isUnreliable,
      hasCriminalRecord,
    }: UpdateEmployeeDto,
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
      patronymic,
      bankCard,
      phone,
      region,
      town,
      isActive,
      isUnreliable,
      hasCriminalRecord,
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

    const docIdList = foundEmployee.documents.map((doc) => doc.id)
    const avatarId = foundEmployee.avatars.map((file) => file.id)[0]

    let response = true

    try {
      await Promise.all([
        this.employeeRepository.remove(foundEmployee),
        docIdList.length && this.fileUploadService.deletePublicFiles(docIdList),
        avatarId && this.fileUploadService.deletePublicFile(avatarId),
      ])

      return true
    } catch (e) {
      return false
    }
  }
}
