import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1711572090963 implements MigrationInterface {
    name = 'UpdateSchema1711572090963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`store-container\` CHANGE \`amount\` \`amount\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`store-container\` CHANGE \`amount\` \`amount\` decimal(8,0) NOT NULL DEFAULT '0'`);
    }

}
