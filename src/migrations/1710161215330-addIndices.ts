import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndices1710161215330 implements MigrationInterface {
    name = 'AddIndices1710161215330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(0,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE INDEX \`IDX_3a0e6f3a0fae1e7fac5ca3801d\` ON \`shifts\` (\`dateTo\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_c7496c7e6508db62ba4da839b3\` ON \`employees\` (\`lastName\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_cbc362d1c574464a63d3acc3ea\` ON \`employees\` (\`phone\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_8a28b1e0e38fc81165d5dac229\` ON \`clients\` (\`lastName\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_aa22377d7d3e794ae4cd39cd9e\` ON \`clients\` (\`phone\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_af99afb7cf88ce20aff6977e68\` ON \`users\` (\`lastName\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_a000cca60bcf04454e72769949\` ON \`users\` (\`phone\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_4efbf189b941c4cd29e278f87d\` ON \`works\` (\`title\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_e81b5a92f93b7753219a7e5aa0\` ON \`work-records\` (\`date\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_94a720d7a8b59c3310ca8dafe4\` ON \`batches\` (\`name\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_889cb3fca0bba41b8d78e41dd7\` ON \`batches\` (\`dateFrom\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_119f6fc825074d6121c59026c7\` ON \`varieties\` (\`name\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\` (\`name\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_99ec643394985350747a09d1dc\` ON \`prices\` (\`tenant\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_a2ac58aaa17a5670baa46ca26f\` ON \`prices\` (\`date\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_d3a9115337268e2413392a8ac4\` ON \`drivers\` (\`lastName\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_b97a5a68c766d2d1ec25e6a85b\` ON \`drivers\` (\`phone\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b97a5a68c766d2d1ec25e6a85b\` ON \`drivers\``);
        await queryRunner.query(`DROP INDEX \`IDX_d3a9115337268e2413392a8ac4\` ON \`drivers\``);
        await queryRunner.query(`DROP INDEX \`IDX_a2ac58aaa17a5670baa46ca26f\` ON \`prices\``);
        await queryRunner.query(`DROP INDEX \`IDX_99ec643394985350747a09d1dc\` ON \`prices\``);
        await queryRunner.query(`DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_119f6fc825074d6121c59026c7\` ON \`varieties\``);
        await queryRunner.query(`DROP INDEX \`IDX_889cb3fca0bba41b8d78e41dd7\` ON \`batches\``);
        await queryRunner.query(`DROP INDEX \`IDX_94a720d7a8b59c3310ca8dafe4\` ON \`batches\``);
        await queryRunner.query(`DROP INDEX \`IDX_e81b5a92f93b7753219a7e5aa0\` ON \`work-records\``);
        await queryRunner.query(`DROP INDEX \`IDX_4efbf189b941c4cd29e278f87d\` ON \`works\``);
        await queryRunner.query(`DROP INDEX \`IDX_a000cca60bcf04454e72769949\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_af99afb7cf88ce20aff6977e68\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_aa22377d7d3e794ae4cd39cd9e\` ON \`clients\``);
        await queryRunner.query(`DROP INDEX \`IDX_8a28b1e0e38fc81165d5dac229\` ON \`clients\``);
        await queryRunner.query(`DROP INDEX \`IDX_cbc362d1c574464a63d3acc3ea\` ON \`employees\``);
        await queryRunner.query(`DROP INDEX \`IDX_c7496c7e6508db62ba4da839b3\` ON \`employees\``);
        await queryRunner.query(`DROP INDEX \`IDX_3a0e6f3a0fae1e7fac5ca3801d\` ON \`shifts\``);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`trip\` \`trip\` decimal(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cuttings\` CHANGE \`boxQuantity\` \`boxQuantity\` decimal(10,0) NOT NULL DEFAULT '0'`);
    }

}
