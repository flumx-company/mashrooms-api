import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1711915614176 implements MigrationInterface {
    name = 'UpdateSchema1711915614176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP COLUMN \`dayNumber\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD \`calendarDayNumber\` decimal(3,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD \`workingDayNumber\` decimal(3,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP COLUMN \`workingDayNumber\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP COLUMN \`calendarDayNumber\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD \`dayNumber\` decimal(3) NOT NULL DEFAULT '0'`);
    }

}
