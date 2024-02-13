import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployees1707756707866 implements MigrationInterface {
    name = 'UpdateEmployees1707756707866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employees_documents_public_file\` (\`employeesId\` int NOT NULL, \`publicFileId\` int NOT NULL, INDEX \`IDX_0aa448289d86bafa46ab602eae\` (\`employeesId\`), INDEX \`IDX_1049b28a79fc6aa15a2ca57710\` (\`publicFileId\`), PRIMARY KEY (\`employeesId\`, \`publicFileId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employees_avatars_public_file\` (\`employeesId\` int NOT NULL, \`publicFileId\` int NOT NULL, INDEX \`IDX_1f22cce2d38f6857945c16967a\` (\`employeesId\`), INDEX \`IDX_2b725d402b0a3edfdb754370e4\` (\`publicFileId\`), PRIMARY KEY (\`employeesId\`, \`publicFileId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`patronymic\` varchar(35) NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`bankCard\` varchar(16) NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`region\` enum ('Київська область', 'Вінницька область', 'Волинська', 'Дніпропетровська', 'Донецька', 'Житомирська', 'Закарпатська', 'Запорізька', 'Івано-Франківська', 'Кіровоградська', 'Крим', 'Луганська', 'Львівська', 'Миколаївська', 'Одеська', 'Полтавська', 'Рівненська', 'Сумська', 'Тернопільська', 'Харківська', 'Херсонська', 'Хмельницька', 'Черкаська', 'Чернівецька', 'Чернігівська') NOT NULL DEFAULT 'Дніпропетровська'`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`town\` varchar(35) NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`isActive\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`isUnreliable\` tinyint NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`hasCriminalRecord\` tinyint NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`phone\` varchar(15) NULL`);
        await queryRunner.query(`ALTER TABLE \`employees_documents_public_file\` ADD CONSTRAINT \`FK_0aa448289d86bafa46ab602eae5\` FOREIGN KEY (\`employeesId\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`employees_documents_public_file\` ADD CONSTRAINT \`FK_1049b28a79fc6aa15a2ca577102\` FOREIGN KEY (\`publicFileId\`) REFERENCES \`public_file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employees_avatars_public_file\` ADD CONSTRAINT \`FK_1f22cce2d38f6857945c16967a7\` FOREIGN KEY (\`employeesId\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`employees_avatars_public_file\` ADD CONSTRAINT \`FK_2b725d402b0a3edfdb754370e46\` FOREIGN KEY (\`publicFileId\`) REFERENCES \`public_file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employees_avatars_public_file\` DROP FOREIGN KEY \`FK_2b725d402b0a3edfdb754370e46\``);
        await queryRunner.query(`ALTER TABLE \`employees_avatars_public_file\` DROP FOREIGN KEY \`FK_1f22cce2d38f6857945c16967a7\``);
        await queryRunner.query(`ALTER TABLE \`employees_documents_public_file\` DROP FOREIGN KEY \`FK_1049b28a79fc6aa15a2ca577102\``);
        await queryRunner.query(`ALTER TABLE \`employees_documents_public_file\` DROP FOREIGN KEY \`FK_0aa448289d86bafa46ab602eae5\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`hasCriminalRecord\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`isUnreliable\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`town\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`region\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`bankCard\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`patronymic\``);
        await queryRunner.query(`DROP INDEX \`IDX_2b725d402b0a3edfdb754370e4\` ON \`employees_avatars_public_file\``);
        await queryRunner.query(`DROP INDEX \`IDX_1f22cce2d38f6857945c16967a\` ON \`employees_avatars_public_file\``);
        await queryRunner.query(`DROP TABLE \`employees_avatars_public_file\``);
        await queryRunner.query(`DROP INDEX \`IDX_1049b28a79fc6aa15a2ca57710\` ON \`employees_documents_public_file\``);
        await queryRunner.query(`DROP INDEX \`IDX_0aa448289d86bafa46ab602eae\` ON \`employees_documents_public_file\``);
        await queryRunner.query(`DROP TABLE \`employees_documents_public_file\``);
    }

}
