import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWork1708529784729 implements MigrationInterface {
    name = 'UpdateWork1708529784729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`works\` CHANGE \`pay\` \`price\` varchar(255) NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`nickname\` varchar(35) NULL`);
        await queryRunner.query(`ALTER TABLE \`works\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`works\` ADD \`price\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`drivers\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`drivers\` ADD \`phone\` varchar(15) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`drivers\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`drivers\` ADD \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`works\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`works\` ADD \`price\` varchar(255) NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`nickname\``);
        await queryRunner.query(`ALTER TABLE \`works\` CHANGE \`price\` \`pay\` varchar(255) NULL DEFAULT '0'`);
    }

}
