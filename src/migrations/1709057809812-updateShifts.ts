import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateShifts1709057809812 implements MigrationInterface {
    name = 'UpdateShifts1709057809812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP FOREIGN KEY \`FK_ac74b69d4e1307cf392660ace63\``);
        await queryRunner.query(`ALTER TABLE \`shifts\` CHANGE \`employeeId\` \`employeeId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` CHANGE \`isActive\` \`isActive\` tinyint NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD CONSTRAINT \`FK_ac74b69d4e1307cf392660ace63\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP FOREIGN KEY \`FK_ac74b69d4e1307cf392660ace63\``);
        await queryRunner.query(`ALTER TABLE \`employees\` CHANGE \`isActive\` \`isActive\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`shifts\` CHANGE \`employeeId\` \`employeeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD CONSTRAINT \`FK_ac74b69d4e1307cf392660ace63\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
