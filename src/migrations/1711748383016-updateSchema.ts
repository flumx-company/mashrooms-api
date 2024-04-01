import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1711748383016 implements MigrationInterface {
    name = 'UpdateSchema1711748383016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`offloads_documents_public_file\` (\`offloadsId\` int NOT NULL, \`publicFileId\` int NOT NULL, INDEX \`IDX_6b5bf9c1df8a964fd466530ddc\` (\`offloadsId\`), INDEX \`IDX_34c378b2ef36d1cd21a21a01d0\` (\`publicFileId\`), PRIMARY KEY (\`offloadsId\`, \`publicFileId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`offloads_documents_public_file\` ADD CONSTRAINT \`FK_6b5bf9c1df8a964fd466530ddc3\` FOREIGN KEY (\`offloadsId\`) REFERENCES \`offloads\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads_documents_public_file\` ADD CONSTRAINT \`FK_34c378b2ef36d1cd21a21a01d0e\` FOREIGN KEY (\`publicFileId\`) REFERENCES \`public_file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads_documents_public_file\` DROP FOREIGN KEY \`FK_34c378b2ef36d1cd21a21a01d0e\``);
        await queryRunner.query(`ALTER TABLE \`offloads_documents_public_file\` DROP FOREIGN KEY \`FK_6b5bf9c1df8a964fd466530ddc3\``);
        await queryRunner.query(`DROP INDEX \`IDX_34c378b2ef36d1cd21a21a01d0\` ON \`offloads_documents_public_file\``);
        await queryRunner.query(`DROP INDEX \`IDX_6b5bf9c1df8a964fd466530ddc\` ON \`offloads_documents_public_file\``);
        await queryRunner.query(`DROP TABLE \`offloads_documents_public_file\``);
    }

}
