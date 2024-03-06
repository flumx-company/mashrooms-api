import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWatering1709748183999 implements MigrationInterface {
    name = 'UpdateWatering1709748183999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`waterings\` ADD \`dateTimeFrom\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`waterings\` DROP COLUMN \`dateTimeTo\``);
        await queryRunner.query(`ALTER TABLE \`waterings\` ADD \`dateTimeTo\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`waterings\` DROP COLUMN \`dateTimeTo\``);
        await queryRunner.query(`ALTER TABLE \`waterings\` ADD \`dateTimeTo\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`waterings\` DROP COLUMN \`dateTimeFrom\``);
    }

}
