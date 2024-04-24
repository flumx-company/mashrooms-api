import { EFileCategory } from '@mush/core/enums';
import { PaginateQuery, Paginated, paginate, FilterOperator } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CError, Nullable } from '@mush/core/utils'

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
    @InjectRepository(PublicFile)
    private publicFileRepository: Repository<PublicFile>,
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

  findClientByIdWithRelations(id: number): Promise<Nullable<Client>> {
    return this.clientRepository
      .createQueryBuilder('client')
      .where('client.id = :id', { id })
      .getOne()
  }

  findClientDocuments(
    query: PaginateQuery,
    id: number,
  ): Promise<Paginated<PublicFile>> {
    const updatedQuery = {
      ...query,
      'filter': {
        "clientFiles.id": id
      }
    };
    return paginate(updatedQuery, this.publicFileRepository, {
      relations: [EFileCategory.CLIENT_FILES],
      sortableColumns: ['clientFiles.id'],
      filterableColumns: {
        ['clientFiles.id']: [FilterOperator.EQ],
      },
    });
  }

  async createClient(
    {
      firstName,
      lastName,
      patronymic,
      nickname,
      phone,
      moneyDebt,
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
      delContainerSchoellerDebt,
    }: CreateClientDto,
    files: BufferedFile[],
  ): Promise<Client> {
    const foundClientByPhone = await this.findClientByPhone(phone)
    let fileListData: PublicFile[]

    if (foundClientByPhone) {
      throw new HttpException(
        CError.PHONE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (files) {
      fileListData = await this.fileUploadService.uploadPublicFiles(files)
    }

    const newClient: Client = this.clientRepository.create({
      firstName,
      lastName,
      patronymic,
      nickname,
      phone,
      moneyDebt,
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
      delContainerSchoellerDebt,
      files: fileListData || [],
    })

    return this.clientRepository.save(newClient)
  }

  async updateClient(
    id: number,
    {
      firstName,
      lastName,
      patronymic,
      nickname,
      phone,
      moneyDebt,
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
      delContainerSchoellerDebt,
    }: UpdateClientDto,
  ): Promise<Client> {
    const [foundClientById, foundClientByPhone]: Nullable<Client>[] =
      await Promise.all([
        this.findClientById(id),
        this.findClientByPhone(phone),
      ])

    if (!foundClientById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    if (foundClientByPhone && foundClientByPhone.id !== id) {
      throw new HttpException(
        CError.PHONE_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      )
    }

    const updatedClient: Client = this.clientRepository.create({
      ...foundClientById,
      firstName,
      lastName,
      patronymic,
      nickname,
      phone,
      moneyDebt,
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
      delContainerSchoellerDebt,
    })

    return this.clientRepository.save(updatedClient)
  }

  async updateClientDebt({
    id,
    moneyDebt,
    delContainer1_7Debt,
    delContainer0_5Debt,
    delContainer0_4Debt,
    delContainerSchoellerDebt,
  }: {
    id: number
    moneyDebt: number
    delContainer1_7Debt: number
    delContainer0_5Debt: number
    delContainer0_4Debt: number
    delContainerSchoellerDebt: number
  }) {
    const foundClientById: Client = await this.findClientById(id)

    if (!foundClientById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const updatedClient: Client = this.clientRepository.create({
      ...foundClientById,
      moneyDebt,
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
      delContainerSchoellerDebt,
    })

    return this.clientRepository.save(updatedClient)
  }

  async removeClient(id: number): Promise<Boolean> {
    const foundClient: Nullable<Client> =
      await this.findClientByIdWithRelations(id)

    if (!foundClient) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const { offloads } = foundClient

    if (offloads.length) {
      throw new HttpException(
        CError.ENTITY_HAS_DEPENDENT_RELATIONS,
        HttpStatus.BAD_REQUEST,
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
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    return foundClient
  }

  async getFilesByClientId(id: number): Promise<Nullable<PublicFile[]>> {
    const foundClient = await this.findClientByIdWithRelations(id)

    if (!foundClient) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    return foundClient.files
  }

  async addClientFiles(
    id: number,
    clientFiles: BufferedFile[],
  ): Promise<Nullable<Client>> {
    if (!clientFiles || !clientFiles.length) {
      throw new HttpException(CError.NO_FILE_PROVIDED, HttpStatus.BAD_REQUEST)
    }

    const foundClient = await this.findClientByIdWithRelations(id)

    if (!foundClient) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
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
    const foundClient: Nullable<Client> =
      await this.findClientByIdWithRelations(clientId)

    if (!foundClient) {
      throw new HttpException(
        CError.NOT_FOUND_CLIENT_ID,
        HttpStatus.BAD_REQUEST,
      )
    }

    const foundFile = foundClient.files.find((file) => file.id === fileId)

    if (!foundFile) {
      throw new HttpException(
        CError.FILE_ID_NOT_RELATED,
        HttpStatus.BAD_REQUEST,
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
