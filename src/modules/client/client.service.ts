import { EFileCategory } from '@mush/core/enums';
import { ReturnBoxDto } from '@mush/modules/client/dto/return.box.dto';
import { PaginateQuery, Paginated, paginate, FilterOperator } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { Transactional } from 'typeorm-transactional'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CError, Nullable } from '@mush/core/utils'

import { FileUploadService } from '../file-upload/file-upload.service'
import { BufferedFile } from '../file-upload/file.model'
import { PublicFile } from '../file-upload/public-file.entity'
import { Client } from './client.entity'
import { ClientMovementService } from './client-movement.service'
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
    private readonly clientMovementService: ClientMovementService,
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
      .leftJoinAndSelect('client.offloads', 'offloads')
      .leftJoinAndSelect('client.files', 'files')
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
        "clientFiles.id": `${id}`
      }
    };
    return paginate(updatedQuery, this.publicFileRepository, {
      relations: [EFileCategory.CLIENT_FILES],
      sortableColumns: ['clientFiles.id', 'id'],
      filterableColumns: {
        ['clientFiles.id']: [FilterOperator.EQ],
      },
    });
  }

  @Transactional()
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

  @Transactional()
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

  async updateBoxClient(
    id: number,
    {
      delContainer1_7Debt,
      delContainer0_5Debt,
      delContainer0_4Debt,
    }: ReturnBoxDto,
  ): Promise<Client> {
    const [foundClientById]: Nullable<Client>[] =
      await Promise.all([
        this.findClientById(id),
      ])

    if (!foundClientById) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const boxesReturned =
      (Number(delContainer1_7Debt) || 0) +
      (Number(delContainer0_5Debt) || 0) +
      (Number(delContainer0_4Debt) || 0)

    const updatedClient: Client = this.clientRepository.create({
      ...foundClientById,
      delContainer1_7Debt: foundClientById.delContainer1_7Debt
        ? foundClientById.delContainer1_7Debt - delContainer1_7Debt
        : -delContainer1_7Debt,
      delContainer0_5Debt: foundClientById.delContainer0_5Debt
        ? foundClientById.delContainer0_5Debt - delContainer0_5Debt
        : -delContainer0_5Debt,
      delContainer0_4Debt: foundClientById.delContainer0_4Debt
        ? foundClientById.delContainer0_4Debt - delContainer0_4Debt
        : -delContainer0_4Debt,
    })

    const saved = await this.clientRepository.save(updatedClient)
    await this.clientMovementService.recordManualBoxReturn(id, boxesReturned)
    return saved
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

  @Transactional()
  async removeClient(id: number): Promise<Boolean> {
    const foundClient: Nullable<Client> =
      await this.findClientByIdWithRelations(id)

    if (!foundClient) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST)
    }

    const { offloads, files } = foundClient

    // Проверяем наличие связанных offloads, но не блокируем удаление
    // так как в базе данных настроено каскадное удаление
    if (offloads && offloads.length > 0) {
      console.warn(`Warning: Deleting client ${id} will also delete ${offloads.length} related offloads due to cascade delete.`)
    }

    const fileIdList = files ? files.map((file) => file.id) : []

    try {
      await Promise.all([
        this.clientRepository.remove(foundClient),
        fileIdList.length &&
          this.fileUploadService.deletePublicFiles(fileIdList),
      ])

      // Логируем успешное удаление с информацией о каскадном удалении
      if (offloads && offloads.length > 0) {
        console.log(`Successfully deleted client ${id} and ${offloads.length} related offloads.`)
      } else {
        console.log(`Successfully deleted client ${id}.`)
      }

      return true
    } catch (e) {
      console.error(`Error deleting client ${id}:`, e)
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

  @Transactional()
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

    const promises = fileListData.map(item => {
      const data = this.publicFileRepository.create({
        ...item,
        clientFiles: [foundClient]
      })

      return this.publicFileRepository.save(data);
    });

    await Promise.all(promises);
    return foundClient;
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
    return await this.fileUploadService.deletePublicFile(fileId)
  }

  /**
   * Уменьшает долг клиента (moneyDebt) на указанную сумму и возвращает обновлённый долг
   */
  async returnClientMoneyDebt(id: number, moneyDebt: number): Promise<number> {
    const client = await this.findClientById(id);
    if (!client) {
      throw new HttpException(CError.NOT_FOUND_ID, HttpStatus.BAD_REQUEST);
    }
    const currentDebt = Number(client.moneyDebt) || 0;
    const payment = Math.abs(Number(moneyDebt)) || 0;
    // Reduce debt by payment and do not allow negative debt here
    const updatedDebt = currentDebt - payment;
    client.moneyDebt = updatedDebt < 0 ? 0 : updatedDebt;
    await this.clientRepository.save(client);
    await this.clientMovementService.recordManualDebtReturn(id, payment);
    return Number(client.moneyDebt);
  }
}
