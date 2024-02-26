import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateShifts1708969085992 implements MigrationInterface {
    name = 'CreateShifts1708969085992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`shifts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dateFrom\` date NOT NULL, \`dateTo\` date NULL, \`employeeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`shifts\` ADD CONSTRAINT \`FK_ac74b69d4e1307cf392660ace63\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shifts\` DROP FOREIGN KEY \`FK_ac74b69d4e1307cf392660ace63\``);
        await queryRunner.query(`DROP TABLE \`shifts\``);
    }

}
