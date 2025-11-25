import { S3 } from 'aws-sdk'
import { randomUUID } from 'crypto'
import * as stream from 'stream'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'

import { EError } from '@mush/core/enums'
import { CError } from '@mush/core/utils'

import { BufferedFile } from './file.model'
import { PublicFile } from './public-file.entity'

@Injectable()
export class FileUploadService implements OnModuleInit {
  private s3: S3
  private readonly logger = new Logger(FileUploadService.name)
  private readonly bucketName: string

  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get('MINIO_BUCKET')
    
    if (!this.bucketName) {
      this.logger.error('MINIO_BUCKET is not configured in environment variables')
      throw new Error('MINIO_BUCKET environment variable is required')
    }
    
    this.s3 = new S3({
      accessKeyId: this.configService.get('MINIO_ACCESS_KEY'),
      secretAccessKey: this.configService.get('MINIO_SECRET_KEY'),
      region: this.configService.get('MINIO_REGION'),
      endpoint: `${this.configService.get(
        'MINIO_ENDPOINT',
      )}:${this.configService.get('MINIO_PORT')}`,
      s3ForcePathStyle: this.configService.get('MINIO_S3_FORCE_PATH_STYLE'),
      signatureVersion: this.configService.get('MINIO_SIGNATURE_VERSION'),
    })
  }

  async onModuleInit() {
    await this.ensureBucketExists()
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      // Проверяем, существует ли bucket
      await this.s3.headBucket({ Bucket: this.bucketName }).promise()
      this.logger.log(`Bucket "${this.bucketName}" already exists`)
    } catch (error) {
      if (error.statusCode === 404 || error.code === 'NotFound' || error.code === 'NoSuchBucket') {
        // Bucket не существует, создаем его
        // Для MinIO не требуется LocationConstraint
        try {
          await this.s3
            .createBucket({
              Bucket: this.bucketName,
            })
            .promise()
          this.logger.log(`Bucket "${this.bucketName}" created successfully`)
        } catch (createError) {
          // Если bucket уже был создан другим процессом, это нормально
          if (createError.code === 'BucketAlreadyOwnedByYou' || createError.code === 'BucketAlreadyExists') {
            this.logger.log(`Bucket "${this.bucketName}" already exists (created by another process)`)
          } else {
            this.logger.error(`Failed to create bucket "${this.bucketName}":`, createError)
            throw createError
          }
        }
      } else {
        // Другая ошибка (например, нет доступа)
        this.logger.error(`Error checking bucket "${this.bucketName}":`, error)
        throw error
      }
    }
  }

  private async removeS3file(fileInfo) {
    await Promise.all([
      this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: fileInfo.key,
        })
        .promise(),
      this.publicFilesRepository.remove(fileInfo),
    ])
  }

  async uploadPublicFile(file: BufferedFile): Promise<PublicFile> {
    // Убеждаемся, что bucket существует перед загрузкой
    await this.ensureBucketExists()
    
    const { buffer, fieldname, originalname, mimetype } = file
    const uploadResult = await this.s3
      .upload({
        Bucket: this.bucketName,
        Body: buffer,
        Key: `${fieldname}/${randomUUID()}-${originalname}`,
      })
      .promise()

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
      type: mimetype,
      name: originalname,
    })

    await this.publicFilesRepository.save(newFile)

    return newFile
  }

  async uploadPublicFiles(files: BufferedFile[]): Promise<PublicFile[]> {
    // Убеждаемся, что bucket существует перед загрузкой
    await this.ensureBucketExists()
    
    const uploadResultList = await Promise.all(
      files.map(({ buffer, fieldname, originalname }) => {
        return this.s3
          .upload({
            Bucket: this.bucketName,
            Body: buffer,
            Key: `${fieldname}/${randomUUID()}-${originalname}`,
          })
          .promise()
      }),
    )

    const newFileList = await Promise.all(
      uploadResultList.map(async (uploadResult, index) => {
        const newFile = this.publicFilesRepository.create({
          key: uploadResult.Key,
          url: uploadResult.Location,
          type: files[index].mimetype,
          name: files[index].originalname,
        })

        await this.publicFilesRepository.save(newFile)

        return newFile
      }),
    )

    return newFileList
  }

  async deletePublicFile(fileId: number): Promise<boolean> {
    const fileInfo = await this.publicFilesRepository.findOneBy({ id: fileId })

    if (!fileInfo) {
      return true
    }

    try {
      await this.removeS3file(fileInfo)
      return true
    } catch (e) {
      return false
    }
  }

  async deletePublicFiles(fileIds: number[]): Promise<boolean> {
    let fileListInfo = await Promise.all(
      fileIds.map((id) => this.publicFilesRepository.findOneBy({ id })),
    )
    fileListInfo = fileListInfo.filter(
      (info) => info !== null && info !== undefined,
    )

    if (!fileListInfo.length) {
      return true
    }

    try {
      await Promise.all(
        fileListInfo.map((fileInfo) => this.removeS3file(fileInfo)),
      )

      return true
    } catch (e) {
      return false
    }
  }

  async getFile(
    id: number,
    category: string,
  ): Promise<{ fileInfo: PublicFile; stream: stream.Readable }> {
    const fileInfo: PublicFile = await this.publicFilesRepository.findOneBy({
      id,
    })
    // const fileCategoryPattern = new RegExp('^' + category)
    //
    // if (!fileCategoryPattern.test(fileInfo.key)) {
    //   throw new HttpException(
    //     `${CError.FILE_ID_NOT_RELATED_TO_SECTION} ${category}`,
    //     HttpStatus.BAD_REQUEST,
    //   )
    // }

    if (fileInfo) {
      const stream = this.s3
        .getObject({
          Bucket: this.bucketName,
          Key: fileInfo.key,
        })
        .createReadStream()

      return {
        fileInfo,
        stream,
      }
    }

    throw new HttpException(CError.NOT_FOUND_FILE, HttpStatus.BAD_REQUEST)
  }
}
