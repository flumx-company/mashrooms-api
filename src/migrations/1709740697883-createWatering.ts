import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWatering1709740697883 implements MigrationInterface {
    name = 'CreateWatering1709740697883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`waterings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`volume\` decimal(7,0) NOT NULL DEFAULT '0', \`dateTimeFrom\` date NOT NULL, \`dateTimeTo\` date NULL, \`target\` enum ('MUSHROOM', 'PEAT') NOT NULL DEFAULT 'MUSHROOM', \`hasDrug\` tinyint NULL DEFAULT 0, \`shiftId\` int NULL, \`batchId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`waterings\` ADD CONSTRAINT \`FK_a6803aaece5dc2e7d3f8f6b45b9\` FOREIGN KEY (\`shiftId\`) REFERENCES \`shifts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`waterings\` ADD CONSTRAINT \`FK_911fae0bd5227677056eb35bc75\` FOREIGN KEY (\`batchId\`) REFERENCES \`batches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`waterings\` DROP FOREIGN KEY \`FK_911fae0bd5227677056eb35bc75\``);
        await queryRunner.query(`ALTER TABLE \`waterings\` DROP FOREIGN KEY \`FK_a6803aaece5dc2e7d3f8f6b45b9\``);
        await queryRunner.query(`DROP TABLE \`waterings\``);
    }

}
