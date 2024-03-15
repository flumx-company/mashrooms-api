import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWorkRecord1710509447681 implements MigrationInterface {
    name = 'UpdateWorkRecord1710509447681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`work-records\` CHANGE \`recordGoupId\` \`recordGroupId\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`work-records\` CHANGE \`recordGroupId\` \`recordGroupId\` decimal(15,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`work-records\` CHANGE \`recordGroupId\` \`recordGroupId\` decimal(15) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`work-records\` CHANGE \`recordGroupId\` \`recordGoupId\` decimal(15) NOT NULL DEFAULT '0'`);
    }

}
