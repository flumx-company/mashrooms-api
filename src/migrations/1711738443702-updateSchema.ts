import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1711738443702 implements MigrationInterface {
    name = 'UpdateSchema1711738443702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`boxTotalQuantity\` decimal(8,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`boxTotalQuantity\``);
    }

}
