import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBatches1709629853026 implements MigrationInterface {
    name = 'CreateBatches1709629853026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`waves\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(1) NULL, \`dateFrom\` date NOT NULL, \`dateTo\` date NULL, \`batchId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`batches\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(8) NULL, \`compostSupplier\` varchar(50) NULL, \`compostWeight\` decimal(10,2) NOT NULL DEFAULT '0.00', \`briquetteQuantity\` decimal(10,2) NOT NULL DEFAULT '0.00', \`compostPrice\` decimal(10,2) NOT NULL DEFAULT '0.00', \`peatSupplier\` varchar(50) NULL, \`peatWeight\` decimal(10,2) NOT NULL DEFAULT '0.00', \`peatPrice\` decimal(10,2) NOT NULL DEFAULT '0.00', \`waveQuantity\` decimal(3,0) NOT NULL DEFAULT '0', \`chamberId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`waves\` ADD CONSTRAINT \`FK_35837e33cb59c62630015bc8ae7\` FOREIGN KEY (\`batchId\`) REFERENCES \`batches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD CONSTRAINT \`FK_43cdd42370021bbac239841481b\` FOREIGN KEY (\`chamberId\`) REFERENCES \`chambers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`batches\` DROP FOREIGN KEY \`FK_43cdd42370021bbac239841481b\``);
        await queryRunner.query(`ALTER TABLE \`waves\` DROP FOREIGN KEY \`FK_35837e33cb59c62630015bc8ae7\``);
        await queryRunner.query(`DROP TABLE \`batches\``);
        await queryRunner.query(`DROP TABLE \`waves\``);
    }

}
