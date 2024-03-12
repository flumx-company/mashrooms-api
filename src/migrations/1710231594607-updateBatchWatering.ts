import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBatchWatering1710231594607 implements MigrationInterface {
    name = 'UpdateBatchWatering1710231594607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`compostLoadDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`peatLoadDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`waterings\` DROP COLUMN \`drug\``);
        await queryRunner.query(`ALTER TABLE \`waterings\` ADD \`drug\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE INDEX \`IDX_951db19e3054ca438db30dad94\` ON \`batches\` (\`compostLoadDate\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_b02213a6102e400c8115d93034\` ON \`batches\` (\`peatLoadDate\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b02213a6102e400c8115d93034\` ON \`batches\``);
        await queryRunner.query(`DROP INDEX \`IDX_951db19e3054ca438db30dad94\` ON \`batches\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`waterings\` DROP COLUMN \`drug\``);
        await queryRunner.query(`ALTER TABLE \`waterings\` ADD \`drug\` tinyint NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`peatLoadDate\``);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`compostLoadDate\``);
    }

}
