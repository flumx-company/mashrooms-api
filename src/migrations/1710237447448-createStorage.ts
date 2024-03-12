import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStorage1710237447448 implements MigrationInterface {
    name = 'CreateStorage1710237447448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_951db19e3054ca438db30dad94\` ON \`batches\``);
        await queryRunner.query(`DROP INDEX \`IDX_b02213a6102e400c8115d93034\` ON \`batches\``);
        await queryRunner.query(`CREATE TABLE \`storages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`date\` date NOT NULL, \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`waveId\` int NULL, \`varietyId\` int NULL, INDEX \`IDX_e55034cc2d1446efd0d3e65452\` (\`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stores\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`storages\` ADD CONSTRAINT \`FK_9fc77c15126327cc428a609ca72\` FOREIGN KEY (\`waveId\`) REFERENCES \`waves\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`storages\` ADD CONSTRAINT \`FK_76b7ddd03acca3e1198f83f3e3d\` FOREIGN KEY (\`varietyId\`) REFERENCES \`varieties\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`storages\` DROP FOREIGN KEY \`FK_76b7ddd03acca3e1198f83f3e3d\``);
        await queryRunner.query(`ALTER TABLE \`storages\` DROP FOREIGN KEY \`FK_9fc77c15126327cc428a609ca72\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE \`stores\``);
        await queryRunner.query(`DROP INDEX \`IDX_e55034cc2d1446efd0d3e65452\` ON \`storages\``);
        await queryRunner.query(`DROP TABLE \`storages\``);
        await queryRunner.query(`CREATE INDEX \`IDX_b02213a6102e400c8115d93034\` ON \`batches\` (\`peatLoadDate\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_951db19e3054ca438db30dad94\` ON \`batches\` (\`compostLoadDate\`)`);
    }

}
