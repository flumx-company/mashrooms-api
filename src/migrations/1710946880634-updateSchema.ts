import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1710946880634 implements MigrationInterface {
    name = 'UpdateSchema1710946880634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`store-container\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(35) NULL, \`weight\` decimal(10,2) NOT NULL DEFAULT '0.00', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`cuttingDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`weight\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`amount\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`price\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`docId\` decimal(15,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`priceId\` decimal(16,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`authorId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`clientId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`driverId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`storeContainerId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`categoryId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`waveId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`varietyId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`batchId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_ac64717d1e3cc490e78428588e9\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_37ce31b9a5733b42bfa2129471e\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_287941f174418d59182eeb37279\` FOREIGN KEY (\`driverId\`) REFERENCES \`drivers\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_46eb599196a418398dbf6904cc5\` FOREIGN KEY (\`storeContainerId\`) REFERENCES \`store-container\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_83f20e17989da6794618a3413de\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_891a8ffed9ae96890844354d55c\` FOREIGN KEY (\`waveId\`) REFERENCES \`waves\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_6a18fb1963739b95654a7e8b372\` FOREIGN KEY (\`varietyId\`) REFERENCES \`varieties\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_c4bf145dcf614aca2d8b249cf34\` FOREIGN KEY (\`batchId\`) REFERENCES \`batches\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_c4bf145dcf614aca2d8b249cf34\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_6a18fb1963739b95654a7e8b372\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_891a8ffed9ae96890844354d55c\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_83f20e17989da6794618a3413de\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_46eb599196a418398dbf6904cc5\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_287941f174418d59182eeb37279\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_37ce31b9a5733b42bfa2129471e\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_ac64717d1e3cc490e78428588e9\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`batchId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`varietyId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`waveId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`categoryId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`storeContainerId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`driverId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`authorId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`priceId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`docId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`weight\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`cuttingDate\``);
        await queryRunner.query(`DROP TABLE \`store-container\``);
    }

}
