import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCutting1709896930851 implements MigrationInterface {
    name = 'AddCutting1709896930851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`cuttings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0', \`trip\` decimal(0,0) NOT NULL DEFAULT '0', \`categoryId\` int NOT NULL, \`varietyId\` int NOT NULL, \`batchId\` int NOT NULL, \`waveId\` int NOT NULL, \`shiftId\` int NOT NULL, \`authorId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` ADD CONSTRAINT \`FK_976029b3a83a00ec835eea27df5\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` ADD CONSTRAINT \`FK_696381b0e4f6e2b2c7cf7558cb7\` FOREIGN KEY (\`varietyId\`) REFERENCES \`varieties\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` ADD CONSTRAINT \`FK_91b372104fa6a91c62229cf35fb\` FOREIGN KEY (\`batchId\`) REFERENCES \`batches\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` ADD CONSTRAINT \`FK_91a015582a3f197e46ccf3ca01b\` FOREIGN KEY (\`waveId\`) REFERENCES \`waves\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` ADD CONSTRAINT \`FK_8236a051ac07f4110eff49cd3d9\` FOREIGN KEY (\`shiftId\`) REFERENCES \`shifts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` ADD CONSTRAINT \`FK_551e1a1071331d4079ed0ec8afd\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cuttings\` DROP FOREIGN KEY \`FK_551e1a1071331d4079ed0ec8afd\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` DROP FOREIGN KEY \`FK_8236a051ac07f4110eff49cd3d9\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` DROP FOREIGN KEY \`FK_91a015582a3f197e46ccf3ca01b\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` DROP FOREIGN KEY \`FK_91b372104fa6a91c62229cf35fb\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` DROP FOREIGN KEY \`FK_696381b0e4f6e2b2c7cf7558cb7\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` DROP FOREIGN KEY \`FK_976029b3a83a00ec835eea27df5\``);
        await queryRunner.query(`DROP TABLE \`cuttings\``);
    }

}
