import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { google } from 'googleapis';
import * as config from '../../../google-drive-key.json';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class BackupMinioService {
  private readonly logger = new Logger(BackupMinioService.name);
  private readonly s3: S3;
  private readonly bucketName = process.env.MINIO_BUCKET;
  private readonly backupDir = './backups';
  private readonly driveFolderId = process.env.MINIO_DRIVE_FOLDER_ID;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.MINIO_ACCESS_KEY,
      secretAccessKey: process.env.MINIO_SECRET_KEY,
      region: process.env.MINIO_REGION,
      endpoint: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
      s3ForcePathStyle:  true ,
      signatureVersion: process.env.MINIO_SIGNATURE_VERSION,
    })

    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * 📅 Запускает бэкап каждый день в 03:00
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleScheduledBackup() {
    this.logger.log('Starting daily MinIO backup...');
    const backupFile = await this.createBackup();
    await this.uploadToGoogleDrive(backupFile);
    await this.cleanupOldBackupsOnDrive();
    this.logger.log('MinIO backup process completed.');
  }

  /**
   * 📦 Создаёт архив с файлами из MinIO
   */
  async createBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const zipFilePath = path.join(this.backupDir, `minio-backup-${timestamp}.zip`);
      const archive = archiver('zip', { zlib: { level: 9 } });
      const output = fs.createWriteStream(zipFilePath);
      archive.pipe(output);

      const files = await this.s3.listObjectsV2({ Bucket: this.bucketName }).promise();
      if (!files.Contents || files.Contents.length === 0) {
        this.logger.log('No files found for backup.');
        return zipFilePath;
      }

      for (const file of files.Contents) {
        if (!file.Key) continue;
        const object = await this.s3.getObject({ Bucket: this.bucketName, Key: file.Key }).promise();
        if (object.Body) {
          archive.append(object.Body, { name: file.Key });
        }
      }

      await archive.finalize();
      this.logger.log(`Backup created: ${zipFilePath}`);
      return zipFilePath;
    } catch (error) {
      this.logger.error('Backup creation failed:', error);
      throw new Error('Backup creation failed');
    }
  }

  /**
   * ☁️ Загружает бэкап на Google Drive
   */
  async uploadToGoogleDrive(backupFile: string): Promise<void> {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: config,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      const drive = google.drive({ version: 'v3', auth });

      const fileMetadata = {
        name: path.basename(backupFile),
        parents: [this.driveFolderId],
      };

      const media = {
        mimeType: 'application/zip',
        body: fs.createReadStream(backupFile),
      };

      await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });

      this.logger.log(`Backup uploaded to Google Drive: ${backupFile}`);
    } catch (error) {
      this.logger.error('Upload to Google Drive failed:', error);
      throw new Error('Google Drive upload failed');
    }
  }

  /**
   * 🗑 Очищает старые бэкапы (старше 10 дней) на Google Drive
   */
  async cleanupOldBackupsOnDrive(): Promise<void> {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: config,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      const drive = google.drive({ version: 'v3', auth });

      const response = await drive.files.list({
        q: `'${this.driveFolderId}' in parents and mimeType='application/zip'`,
        fields: 'files(id, name, createdTime)',
      });

      const files = response.data.files;
      if (!files || files.length === 0) {
        this.logger.log('No old backups found on Google Drive.');
        return;
      }

      const now = new Date();
      const oldFiles = files.filter((file) => {
        const createdTime = new Date(file.createdTime);
        const ageInDays = (now.getTime() - createdTime.getTime()) / (1000 * 60 * 60 * 24);
        return ageInDays > 10;
      });

      for (const file of oldFiles) {
        await drive.files.delete({ fileId: file.id });
        this.logger.log(`Deleted old backup from Google Drive: ${file.name}`);
      }
    } catch (error) {
      this.logger.error('Google Drive cleanup failed:', error);
    }
  }
}
