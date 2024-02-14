import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Nullable } from '@mush/core/utils'

import { FileUploadService } from '../file-upload/file-upload.service'
import { BufferedFile } from '../file-upload/file.model'
import { PublicFile } from '../file-upload/public-file.entity'
import { Client } from './client.entity'
import { CreateClientDto } from './dto/create.client.dto'
import { UpdateClientDto } from './dto/update.client.dto'
import { clientPaginationConfig } from './pagination'

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Client>> {
    return paginate(query, this.clientRepository, clientPaginationConfig)
  }

  findClientById(id: number): Promise<Nullable<Client>> {
    return this.clientRepository.findOneBy({ id })
  }

  findClientByPhone(phone: string): Promise<Nullable<Client>> {
    return this.clientRepository.findOneBy({ phone })
  }

  findClientByIdWithFiles(id: number): Promise<Nullable<Client>> {
    return this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.files', 'clientFiles')
      .where('client.id = :id', { id })
      .getOne()
  }

  async createClient(
    { firstName, lastName, patronymic, phone }: CreateClientDto,
    files: BufferedFile[],
  ): Promise<Client> {
    const foundClientByPhone = await this.findClientByPhone(phone)
    let fileListData: PublicFile[]

    if (foundClientByPhone) {
      throw new HttpException(
        'A client with this phone already exists.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (files) {
      fileListData = await this.fileUploadService.uploadPublicFiles(files)
    }

    const newClient: Client = this.clientRepository.create({
      firstName,
      lastName,
      patronymic,
      phone,
      files: fileListData || [],
    })

    return this.clientRepository.save(newClient)
  }

  async updateClient(
    id: number,
    { firstName, lastName, patronymic, phone }: UpdateClientDto,
  ): Promise<Client> {
    const [foundClientById, foundClientByPhone]: Nullable<Client>[] =
      await Promise.all([
        this.findClientById(id),
        this.findClientByPhone(phone),
      ])

    if (!foundClientById) {
      throw new HttpException(
        'A client with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    if (foundClientByPhone && foundClientByPhone.id !== id) {
      throw new HttpException(
        'There already exists a different client with this phone.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const updatedClient: Client = this.clientRepository.create({
      ...foundClientById,
      firstName,
      lastName,
      patronymic,
      phone,
    })

    return this.clientRepository.save(updatedClient)
  }

  async removeClient(id: number): Promise<Boolean> {
    const foundClient: Nullable<Client> = await this.findClientByIdWithFiles(id)

    if (!foundClient) {
      throw new HttpException(
        'A client with this id does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const fileIdList = foundClient.files.map((file) => file.id)

    try {
      await Promise.all([
        this.clientRepository.remove(foundClient),
        fileIdList.length &&
          this.fileUploadService.deletePublicFiles(fileIdList),
      ])

      return true
    } catch (e) {
      return false
    }
  }

  async getClientById(id: number): Promise<Nullable<Client>> {
    const foundClient = await this.findClientById(id)

    if (!foundClient) {
      throw new HttpException(
        'There is no client with this id.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    return foundClient
  }

  async getFilesByClientId(id: number): Promise<Nullable<PublicFile[]>> {
    const foundClient = await this.findClientByIdWithFiles(id)

    if (!foundClient) {
      throw new HttpException(
        'There is no client with this id.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    return foundClient.files
  }

  async addClientFiles(
    id: number,
    clientFiles: BufferedFile[],
  ): Promise<Nullable<Client>> {
    if (!clientFiles || !clientFiles.length) {
      throw new HttpException(
        'No client files were provided.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const foundClient = await this.findClientByIdWithFiles(id)

    if (!foundClient) {
      throw new HttpException(
        'There is no client with this id.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const fileListData: PublicFile[] =
      await this.fileUploadService.uploadPublicFiles(clientFiles)

    const updatedClient: Client = this.clientRepository.create({
      ...foundClient,
      files: [...foundClient.files, ...fileListData],
    })

    return this.clientRepository.save(updatedClient)
  }

  async removeClientFile(clientId: number, fileId: number) {
    const foundClient: Nullable<Client> = await this.findClientByIdWithFiles(
      clientId,
    )

    if (!foundClient) {
      throw new HttpException(
        'A client with this clientId does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const foundFile = foundClient.files.find((file) => file.id === fileId)

    if (!foundFile) {
      throw new HttpException(
        'There is no file with this id related to this client.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    try {
      await this.fileUploadService.deletePublicFile(fileId)
      const updatedClientFileList = [...foundClient.files]
      const removedFileIndex = updatedClientFileList.findIndex(
        (file) => file.id === fileId,
      )

      if (removedFileIndex > -1) {
        updatedClientFileList.splice(removedFileIndex, 1)
      }

      const updatedClient: Client = this.clientRepository.create({
        ...foundClient,
        files: updatedClientFileList,
      })

      this.clientRepository.save(updatedClient)

      return true
    } catch (e) {
      return false
    }
  }
}
