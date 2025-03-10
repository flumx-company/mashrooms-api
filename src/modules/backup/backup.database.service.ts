import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as config from '../../../google-drive-key.json';

const execPromise = promisify(exec);

@Injectable()
export class BackupDatabaseService {
  private readonly logger = new Logger(BackupDatabaseService.name);
  private readonly dbUser = 'root';
  private readonly dbPassword = process.env.MYSQL_PASSWORD;
  private readonly dbName = process.env.MYSQL_DATABASE;
  private readonly mysqlContainer = process.env.PMA_HOST;
  private readonly backupDir = './backups';
  private readonly driveFolderId = process.env.DRIVE_FOLDER_ID_FOR_BACKUPS; // ID папки в Google Drive

  constructor() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Щоденний бекап та очищення старих файлів
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleScheduledBackup() {
    this.logger.log('Starting daily backup process...');
    const backupFile = await this.createBackup();
    await this.uploadToGoogleDrive(backupFile);
    await this.cleanupOldBackupsOnDrive();
    this.logger.log('Daily backup process completed.');
  }

  /**
   * Створює бекап бази у MySQL контейнері
   */
  async createBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `${this.backupDir}/backup-${timestamp}.sql`;

      const dumpCommand = `mysqldump -h ${this.mysqlContainer} -u ${this.dbUser} -p${this.dbPassword} ${this.dbName} > ${backupFile}`;
      await execPromise(dumpCommand);

      this.logger.log(`Backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      this.logger.error('Backup creation failed:', error);
      throw new Error('Backup creation failed');
    }
  }

  /**
   * Завантажує бекап на Google Drive
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
        parents: [this.driveFolderId], // Завантажуємо у вказану папку
      };

      const media = {
        mimeType: 'application/sql',
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
   * Видаляє бекапи старше 10 днів із Google Drive
   */
  async cleanupOldBackupsOnDrive(): Promise<void> {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: config,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      const drive = google.drive({ version: 'v3', auth });

      // Отримуємо список файлів у папці Drive
      const response = await drive.files.list({
        q: `'${this.driveFolderId}' in parents and mimeType='application/sql'`,
        fields: 'files(id, name, createdTime)',
      });

      const files = response.data.files;
      if (!files || files.length === 0) {
        this.logger.log('No backups found in Google Drive.');
        return;
      }

      // Визначаємо, які файли старші за 10 днів
      const now = new Date();
      const oldFiles = files.filter((file) => {
        const createdTime = new Date(file.createdTime);
        const ageInDays = (now.getTime() - createdTime.getTime()) / (1000 * 60 * 60 * 24);
        return ageInDays > 10;
      });

      // Видаляємо старі файли
      for (const file of oldFiles) {
        await drive.files.delete({ fileId: file.id });
        this.logger.log(`Deleted old backup from Google Drive: ${file.name}`);
      }
    } catch (error) {
      this.logger.error('Google Drive cleanup failed:', error);
    }
  }
}
