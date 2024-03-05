import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWaves1709634857541 implements MigrationInterface {
    name = 'UpdateWaves1709634857541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`waves\` CHANGE \`name\` \`order\` varchar(1) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`waves\` CHANGE \`order\` \`name\` varchar(1) NULL`);
    }

}
