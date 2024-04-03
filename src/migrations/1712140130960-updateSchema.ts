import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1712140130960 implements MigrationInterface {
    name = 'UpdateSchema1712140130960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`prices\` CHANGE \`tenant\` \`tenant\` enum ('BOX', 'KITCHEN', 'LITER', 'MEDICATED_LITER') NOT NULL DEFAULT 'BOX'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`prices\` CHANGE \`tenant\` \`tenant\` enum ('BARREL', 'BOX', 'KITCHEN') NOT NULL DEFAULT 'BARREL'`);
    }

}
