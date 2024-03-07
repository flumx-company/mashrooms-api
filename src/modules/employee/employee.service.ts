import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import * as stream from 'stream'
import { Repository } from 'typeorm'

import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { EFileCategory } from '@mush/core/enums'
import { CError, Nullable } from '@mush/core/utils'

import { FileUploadService } from '../file-upload/file-upload.service'
import { BufferedFile } from '../file-upload/file.model'
import { PublicFile } from '../file-upload/public-file.entity'
import { CreateEmployeeDto } from './dto/create.employee.dto'
import { UpdateEmployeeDto } from './dto/update.employee.dto'
import { Employee } from './employee.entity'
import { employeePaginationConfig } from './pagination/employee.pagination.config'

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Employee>> {
    return paginate(query, this.employeeRepository, employeePaginationConfig)
  }

  findEmployeeById(id: number): Promise<Nullable<Employee>> {
    return this.employeeRepository.findOneBy({ id })
  }

  findEmployeeByPhone(phone: string): Promise<Nullable<Employee>> {
    return this.employeeRepository.findOneBy({ phone })
  }

  findEmployeesByName(name: string): Promise<Employee[]> {
    return this.employeeRepository
      .createQueryBuilder('employee')
      .select()
      .where('employee.firstName like :name', { name: `%${name}%` })
      .orWhere('employee.lastName like :name', { name: `%${name}%` })
      .getMany()
  }

  findEmployeeByIdWithFiles(id: number): Promise<Nullable<Employee>> {
    return this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.avatars', EFileCategory.EMPLOYEE_AVATARS)
      .where('employee.id = :id', { id })
      .leftJoinAndSelect('employee.documents', EFileCategory.EMPLOYEE_DOCUMENTS)
      .where('employee.id = :id', { id })
      .getOne()
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
        CError.PHONE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
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
      isActive: false,
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
      isUnreliable,
      hasCriminalRecord,
    }: UpdateEmployeeDto,
  ): Promise<Employee> {
    const [foundEmployeeById, foundEmployeeByPhone] = await Promise.all([
      this.findEmployeeById(id),
      this.findEmployeeByPhone(phone),
    ])

    if (!foundEmployeeById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundEmployeeByPhone && foundEmployeeByPhone.id !== id) {
      throw new HttpException(
        CError.PHONE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
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
      isUnreliable,
      hasCriminalRecord,
    })

    return this.employeeRepository.save(updatedEmployee)
  }

  async removeEmployee(id: number): Promise<Boolean> {
    const foundEmployee: Nullable<Employee> =
      await this.findEmployeeByIdWithFiles(id)

    if (!foundEmployee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const docIdList = foundEmployee.documents.map((doc) => doc.id)
    const avatarId = foundEmployee.avatars.map((file) => file.id)[0]

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

  async findEmployeeAvatar(id: number): Promise<StreamableFile> {
    const foundEmployee = await this.findEmployeeByIdWithFiles(id)

    if (!foundEmployee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const avatarId = foundEmployee?.avatars?.[0]?.id

    if (!avatarId) {
      throw new HttpException(CError.NOT_FOUND_AVATAR, HttpStatus.BAD_REQUEST)
    }

    const {
      fileInfo,
      stream,
    }: { fileInfo: PublicFile; stream: stream.Readable } =
      await this.fileUploadService.getFile(
        avatarId,
        EFileCategory.EMPLOYEE_AVATARS,
      )

    return new StreamableFile(stream, {
      disposition: `inline filename="${fileInfo.name}`,
      type: fileInfo.type,
    })
  }

  async changeEmployeeAvatar(
    id: number,
    files: BufferedFile[],
  ): Promise<Nullable<Employee>> {
    if (!files || !files.length) {
      throw new HttpException(CError.NO_FILE_PROVIDED, HttpStatus.BAD_REQUEST)
    }

    const foundEmployee = await this.findEmployeeByIdWithFiles(id)

    if (!foundEmployee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const oldAvatar = foundEmployee?.avatars?.[0]
    const newAvatar = files[0]

    const [_, newAvatarData]: [boolean, PublicFile] = await Promise.all([
      oldAvatar && this.fileUploadService.deletePublicFile(oldAvatar.id),
      this.fileUploadService.uploadPublicFile(newAvatar),
    ])

    const updatedEmpoyee: Employee = this.employeeRepository.create({
      ...foundEmployee,
      avatars: [newAvatarData],
    })

    return this.employeeRepository.save(updatedEmpoyee)
  }

  async removeEmployeeAvatar(id: number): Promise<boolean> {
    const foundEmployee: Employee = await this.findEmployeeByIdWithFiles(id)
    const avatar: PublicFile = foundEmployee?.avatars?.[0]

    if (!foundEmployee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (!avatar) {
      throw new HttpException(CError.NOT_FOUND_AVATAR, HttpStatus.BAD_REQUEST)
    }

    return this.fileUploadService.deletePublicFile(avatar.id)
  }

  async getDocumentsByEmployeeId(id: number): Promise<Nullable<PublicFile[]>> {
    const foundEmployee = await this.findEmployeeByIdWithFiles(id)

    if (!foundEmployee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    return foundEmployee.documents
  }

  async addEmployeeDocuments(
    id: number,
    files: BufferedFile[],
  ): Promise<Nullable<Employee>> {
    if (!files || !files.length) {
      throw new HttpException(CError.NO_FILE_PROVIDED, HttpStatus.BAD_REQUEST)
    }

    const foundEmployee = await this.findEmployeeByIdWithFiles(id)

    if (!foundEmployee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const documentListData: PublicFile[] =
      await this.fileUploadService.uploadPublicFiles(files)

    const updatedEmployee: Employee = this.employeeRepository.create({
      ...foundEmployee,
      documents: [...foundEmployee.documents, ...documentListData],
    })

    return this.employeeRepository.save(updatedEmployee)
  }

  async removeEmployeeDocument(employeeId: number, documentId: number) {
    const foundEmployee: Nullable<Employee> =
      await this.findEmployeeByIdWithFiles(employeeId)

    if (!foundEmployee) {
      throw new HttpException(
        CError.NOT_FOUND_EMPLOYEE_ID,
        HttpStatus.BAD_REQUEST,
      )
    }

    const foundDocument = foundEmployee.documents.find(
      (doc) => doc.id === documentId,
    )

    if (!foundDocument) {
      throw new HttpException(
        CError.FILE_ID_NOT_RELATED,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      await this.fileUploadService.deletePublicFile(documentId)
      const updatedEmployeeDocumentList = [...foundEmployee.documents]
      const removedDocumentIndex = updatedEmployeeDocumentList.findIndex(
        (doc) => doc.id === documentId,
      )

      if (removedDocumentIndex > -1) {
        updatedEmployeeDocumentList.splice(removedDocumentIndex, 1)
      }

      const updatedEmployee: Employee = this.employeeRepository.create({
        ...foundEmployee,
        documents: updatedEmployeeDocumentList,
      })

      this.employeeRepository.save(updatedEmployee)

      return true
    } catch (e) {
      return false
    }
  }

  async updateEmployeeActiveStatus(
    id: number,
    isActive: boolean,
  ): Promise<Employee> {
    const foundEmployee: Nullable<Employee> = await this.findEmployeeById(id)

    if (!foundEmployee) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const updatedEmployee: Employee = this.employeeRepository.create({
      ...foundEmployee,
      isActive,
    })

    return this.employeeRepository.save(updatedEmployee)
  }
}
