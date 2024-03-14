import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubbatch1710434145964 implements MigrationInterface {
    name = 'AddSubbatch1710434145964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`subbatch\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`compostLoadDate\` date NOT NULL, \`compostSupplier\` varchar(50) NULL, \`compostWeight\` decimal(10,2) NOT NULL DEFAULT '0.00', \`compostPrice\` decimal(10,2) NOT NULL DEFAULT '0.00', \`peatLoadDate\` date NOT NULL, \`peatSupplier\` varchar(50) NULL, \`peatWeight\` decimal(10,2) NOT NULL DEFAULT '0.00', \`peatPrice\` decimal(10,2) NOT NULL DEFAULT '0.00', \`batchId\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`compostLoadDate\``);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`compostSupplier\``);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`compostWeight\``);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`compostPrice\``);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`peatLoadDate\``);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`peatSupplier\``);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`peatWeight\``);
        await queryRunner.query(`ALTER TABLE \`batches\` DROP COLUMN \`peatPrice\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`subbatch\` ADD CONSTRAINT \`FK_7410c0ba443e87101962e645998\` FOREIGN KEY (\`batchId\`) REFERENCES \`batches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subbatch\` ADD CONSTRAINT \`FK_d7093bf549b4217651d4ed830c4\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subbatch\` DROP FOREIGN KEY \`FK_d7093bf549b4217651d4ed830c4\``);
        await queryRunner.query(`ALTER TABLE \`subbatch\` DROP FOREIGN KEY \`FK_7410c0ba443e87101962e645998\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`peatPrice\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`peatWeight\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`peatSupplier\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`peatLoadDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`compostPrice\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`compostWeight\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`compostSupplier\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`batches\` ADD \`compostLoadDate\` date NOT NULL`);
        await queryRunner.query(`DROP TABLE \`subbatch\``);
    }

}
