import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePublicFile1707295169806 implements MigrationInterface {
    name = 'CreatePublicFile1707295169806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`public_file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`url\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clients_files_public_file\` (\`clientsId\` int NOT NULL, \`publicFileId\` int NOT NULL, INDEX \`IDX_f8c3c6ca6e5390e97d1718de9f\` (\`clientsId\`), INDEX \`IDX_2453759bfe3d25c55a4c7d7fb3\` (\`publicFileId\`), PRIMARY KEY (\`clientsId\`, \`publicFileId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`patronymic\` varchar(35) NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`phone\` varchar(15) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(15) NULL`);
        await queryRunner.query(`ALTER TABLE \`clients_files_public_file\` ADD CONSTRAINT \`FK_f8c3c6ca6e5390e97d1718de9f3\` FOREIGN KEY (\`clientsId\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`clients_files_public_file\` ADD CONSTRAINT \`FK_2453759bfe3d25c55a4c7d7fb3a\` FOREIGN KEY (\`publicFileId\`) REFERENCES \`public_file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clients_files_public_file\` DROP FOREIGN KEY \`FK_2453759bfe3d25c55a4c7d7fb3a\``);
        await queryRunner.query(`ALTER TABLE \`clients_files_public_file\` DROP FOREIGN KEY \`FK_f8c3c6ca6e5390e97d1718de9f3\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`patronymic\``);
        await queryRunner.query(`DROP INDEX \`IDX_2453759bfe3d25c55a4c7d7fb3\` ON \`clients_files_public_file\``);
        await queryRunner.query(`DROP INDEX \`IDX_f8c3c6ca6e5390e97d1718de9f\` ON \`clients_files_public_file\``);
        await queryRunner.query(`DROP TABLE \`clients_files_public_file\``);
        await queryRunner.query(`DROP TABLE \`public_file\``);
    }

}
