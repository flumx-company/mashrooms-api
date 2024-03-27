import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1711565773077 implements MigrationInterface {
    name = 'UpdateSchema1711565773077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_46eb599196a418398dbf6904cc5\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_6a18fb1963739b95654a7e8b372\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_83f20e17989da6794618a3413de\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_891a8ffed9ae96890844354d55c\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_c4bf145dcf614aca2d8b249cf34\``);
        await queryRunner.query(`CREATE TABLE \`offload-records\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`boxQuantity\` decimal(5,0) NOT NULL DEFAULT '0', \`cuttingDate\` date NOT NULL, \`priceId\` decimal(16,0) NOT NULL DEFAULT '0', \`pricePerBox\` decimal(10,2) NOT NULL DEFAULT '0.00', \`weight\` decimal(10,2) NOT NULL DEFAULT '0.00', \`batchId\` int NOT NULL, \`categoryId\` int NOT NULL, \`offloadId\` int NOT NULL, \`storeContainerId\` int NOT NULL, \`waveId\` int NOT NULL, \`varietyId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`debt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`cuttingDate\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`weight\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`docId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`priceId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`storeContainerId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`categoryId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`waveId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`varietyId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`batchId\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`moneyDebt\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`delContainer1_7Debt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`delContainer0_5Debt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`delContainer0_4Debt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`delContainerSchoellerDebt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`previousMoneyDebt\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`priceTotal\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`paidMoney\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`newMoneyDebt\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer1_7PreviousDebt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer1_7In\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer1_7Out\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer1_7NewDebt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer0_5PreviousDebt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer0_5In\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer0_5Out\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer0_5NewDebt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer0_4PreviousDebt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer0_4In\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer0_4Out\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainer0_4NewDebt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainerSchoellerPreviousDebt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainerSchoellerIn\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainerSchoellerOut\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`delContainerSchoellerNewDebt\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`varieties\` ADD \`isCutterPaid\` tinyint NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offload-records\` ADD CONSTRAINT \`FK_da80ee2ee3e0c8e88d0762c3815\` FOREIGN KEY (\`batchId\`) REFERENCES \`batches\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offload-records\` ADD CONSTRAINT \`FK_d6a3c17bb133664dfa82203a55a\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offload-records\` ADD CONSTRAINT \`FK_a301860daf46348ee2488afc10e\` FOREIGN KEY (\`offloadId\`) REFERENCES \`offloads\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offload-records\` ADD CONSTRAINT \`FK_38a2d989923de17aac315f53a24\` FOREIGN KEY (\`storeContainerId\`) REFERENCES \`store-container\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offload-records\` ADD CONSTRAINT \`FK_36ed45d0737cf63befbb0540794\` FOREIGN KEY (\`waveId\`) REFERENCES \`waves\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offload-records\` ADD CONSTRAINT \`FK_e9085d4152053090407d233585f\` FOREIGN KEY (\`varietyId\`) REFERENCES \`varieties\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offload-records\` DROP FOREIGN KEY \`FK_e9085d4152053090407d233585f\``);
        await queryRunner.query(`ALTER TABLE \`offload-records\` DROP FOREIGN KEY \`FK_36ed45d0737cf63befbb0540794\``);
        await queryRunner.query(`ALTER TABLE \`offload-records\` DROP FOREIGN KEY \`FK_38a2d989923de17aac315f53a24\``);
        await queryRunner.query(`ALTER TABLE \`offload-records\` DROP FOREIGN KEY \`FK_a301860daf46348ee2488afc10e\``);
        await queryRunner.query(`ALTER TABLE \`offload-records\` DROP FOREIGN KEY \`FK_d6a3c17bb133664dfa82203a55a\``);
        await queryRunner.query(`ALTER TABLE \`offload-records\` DROP FOREIGN KEY \`FK_da80ee2ee3e0c8e88d0762c3815\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`varieties\` DROP COLUMN \`isCutterPaid\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainerSchoellerNewDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainerSchoellerOut\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainerSchoellerIn\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainerSchoellerPreviousDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer0_4NewDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer0_4Out\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer0_4In\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer0_4PreviousDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer0_5NewDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer0_5Out\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer0_5In\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer0_5PreviousDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer1_7NewDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer1_7Out\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer1_7In\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`delContainer1_7PreviousDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`newMoneyDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`paidMoney\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`priceTotal\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`previousMoneyDebt\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`delContainerSchoellerDebt\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`delContainer0_4Debt\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`delContainer0_5Debt\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`delContainer1_7Debt\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`moneyDebt\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`batchId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`varietyId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`waveId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`categoryId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`storeContainerId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`priceId\` decimal(16) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`docId\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`price\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`amount\` decimal(5) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`weight\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`cuttingDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`debt\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`DROP TABLE \`offload-records\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_c4bf145dcf614aca2d8b249cf34\` FOREIGN KEY (\`batchId\`) REFERENCES \`batches\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_891a8ffed9ae96890844354d55c\` FOREIGN KEY (\`waveId\`) REFERENCES \`waves\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_83f20e17989da6794618a3413de\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_6a18fb1963739b95654a7e8b372\` FOREIGN KEY (\`varietyId\`) REFERENCES \`varieties\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_46eb599196a418398dbf6904cc5\` FOREIGN KEY (\`storeContainerId\`) REFERENCES \`store-container\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
