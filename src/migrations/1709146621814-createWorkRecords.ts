import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkRecords1709146621814 implements MigrationInterface {
    name = 'CreateWorkRecords1709146621814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`work-records\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`date\` date NOT NULL, \`percent\` decimal(3,2) NOT NULL DEFAULT '0.00', \`percentAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`reward\` decimal(10,2) NOT NULL DEFAULT '0.00', \`workId\` int NOT NULL, \`shiftId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`work-records\` ADD CONSTRAINT \`FK_34f50aeaf8c463d9a98086d20c8\` FOREIGN KEY (\`workId\`) REFERENCES \`works\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`work-records\` ADD CONSTRAINT \`FK_8b2db07030e0784e9df8fa62d31\` FOREIGN KEY (\`shiftId\`) REFERENCES \`shifts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`work-records\` DROP FOREIGN KEY \`FK_8b2db07030e0784e9df8fa62d31\``);
        await queryRunner.query(`ALTER TABLE \`work-records\` DROP FOREIGN KEY \`FK_34f50aeaf8c463d9a98086d20c8\``);
        await queryRunner.query(`DROP TABLE \`work-records\``);
    }

}
