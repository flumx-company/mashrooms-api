import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWorkRecords1709562251482 implements MigrationInterface {
    name = 'UpdateWorkRecords1709562251482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chambers\` DROP COLUMN \`waveQuantity\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chambers\` ADD \`waveQuantity\` decimal(3) NOT NULL DEFAULT '0'`);
    }

}
