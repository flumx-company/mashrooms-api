import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1711126166341 implements MigrationInterface {
    name = 'UpdateSchema1711126166341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`yields\` ADD \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD \`varietyId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD \`batchId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD \`waveId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD CONSTRAINT \`FK_ecd2f323d124d76df856fc661d1\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD CONSTRAINT \`FK_47927babc7b1de627d5b33793e2\` FOREIGN KEY (\`varietyId\`) REFERENCES \`varieties\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD CONSTRAINT \`FK_fe834e250e71a100a014d8bbfdf\` FOREIGN KEY (\`batchId\`) REFERENCES \`batches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD CONSTRAINT \`FK_f9074a1457433d53ca8cd33be4a\` FOREIGN KEY (\`waveId\`) REFERENCES \`waves\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`yields\` DROP FOREIGN KEY \`FK_f9074a1457433d53ca8cd33be4a\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP FOREIGN KEY \`FK_fe834e250e71a100a014d8bbfdf\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP FOREIGN KEY \`FK_47927babc7b1de627d5b33793e2\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP FOREIGN KEY \`FK_ecd2f323d124d76df856fc661d1\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP COLUMN \`waveId\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP COLUMN \`batchId\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP COLUMN \`varietyId\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP COLUMN \`categoryId\``);
    }

}
