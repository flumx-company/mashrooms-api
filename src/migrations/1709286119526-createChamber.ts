import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChamber1709286119526 implements MigrationInterface {
    name = 'CreateChamber1709286119526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chambers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(35) NULL, \`waveQuantity\` decimal(3,0) NOT NULL DEFAULT '0', \`area\` decimal(10,2) NOT NULL DEFAULT '0.00', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`chambers\``);
    }

}
