import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1711025372423 implements MigrationInterface {
    name = 'UpdateSchema1711025372423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` DROP FOREIGN KEY \`FK_235f9ab0b190966e5beb6194596\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD \`date\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD \`weight\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD \`boxQuantity\` decimal(5,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD \`percent\` decimal(6,5) NOT NULL DEFAULT '0.00000'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` ADD CONSTRAINT \`FK_235f9ab0b190966e5beb6194596\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` DROP FOREIGN KEY \`FK_235f9ab0b190966e5beb6194596\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP COLUMN \`percent\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP COLUMN \`boxQuantity\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP COLUMN \`weight\``);
        await queryRunner.query(`ALTER TABLE \`yields\` DROP COLUMN \`date\``);
        await queryRunner.query(`ALTER TABLE \`yields\` ADD \`name\` varchar(70) NULL`);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` ADD CONSTRAINT \`FK_235f9ab0b190966e5beb6194596\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
