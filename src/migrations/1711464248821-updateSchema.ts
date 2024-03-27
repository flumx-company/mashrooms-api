import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1711464248821 implements MigrationInterface {
    name = 'UpdateSchema1711464248821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`delivery-container\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(35) NULL, \`weight\` decimal(10,2) NOT NULL DEFAULT '0.00', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`delivery-container-debt\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`quantity\` decimal(5,0) NOT NULL DEFAULT '0', \`clientId\` int NOT NULL, \`deliveryContainerId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`debt\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`delivery-container-debt\` ADD CONSTRAINT \`FK_752195fc976fbfe5a40e7f360f5\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`delivery-container-debt\` ADD CONSTRAINT \`FK_9ea39f94437c9bd1e79519b2561\` FOREIGN KEY (\`deliveryContainerId\`) REFERENCES \`delivery-container\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`delivery-container-debt\` DROP FOREIGN KEY \`FK_9ea39f94437c9bd1e79519b2561\``);
        await queryRunner.query(`ALTER TABLE \`delivery-container-debt\` DROP FOREIGN KEY \`FK_752195fc976fbfe5a40e7f360f5\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`debt\``);
        await queryRunner.query(`DROP TABLE \`delivery-container-debt\``);
        await queryRunner.query(`DROP TABLE \`delivery-container\``);
    }

}
