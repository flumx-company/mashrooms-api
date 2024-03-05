import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBatches1709632689007 implements MigrationInterface {
    name = 'UpdateBatches1709632689007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`waveQuantity\``);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`dateFrom\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`dateTo\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`dateTo\``);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`dateFrom\``);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`waveQuantity\` decimal(3) NOT NULL DEFAULT '0'`);
    }

}
