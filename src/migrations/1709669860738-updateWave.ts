import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWave1709669860738 implements MigrationInterface {
    name = 'UpdateWave1709669860738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`waves\` DROP COLUMN \`order\``);
        await queryRunner.query(`ALTER TABLE \`waves\` ADD \`order\` decimal(2,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`waves\` DROP COLUMN \`order\``);
        await queryRunner.query(`ALTER TABLE \`waves\` ADD \`order\` varchar(1) NULL`);
    }

}
