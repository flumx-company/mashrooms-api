import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOffloads1704972401893 implements MigrationInterface {
    name = 'UpdateOffloads1704972401893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`clientId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_37ce31b9a5733b42bfa2129471e\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_37ce31b9a5733b42bfa2129471e\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`clientId\``);
    }

}
