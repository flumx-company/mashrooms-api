import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1711734041997 implements MigrationInterface {
    name = 'UpdateSchema1711734041997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`loaderShiftId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_897fe9e7787851d79ecf09904ce\` FOREIGN KEY (\`loaderShiftId\`) REFERENCES \`shifts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_897fe9e7787851d79ecf09904ce\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`loaderShiftId\``);
    }

}
