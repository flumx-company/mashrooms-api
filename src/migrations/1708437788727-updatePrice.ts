import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePrice1708437788727 implements MigrationInterface {
    name = 'UpdatePrice1708437788727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`prices\` DROP COLUMN \`endTime\``);
        await queryRunner.query(`ALTER TABLE \`prices\` DROP COLUMN \`startTime\``);
        await queryRunner.query(`ALTER TABLE \`prices\` ADD \`date\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`works\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`works\` ADD \`title\` varchar(35) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`works\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`works\` ADD \`title\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`prices\` DROP COLUMN \`date\``);
        await queryRunner.query(`ALTER TABLE \`prices\` ADD \`startTime\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`prices\` ADD \`endTime\` date NOT NULL`);
    }

}
