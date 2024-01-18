import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableRelations1705574901567 implements MigrationInterface {
    name = 'UpdateTableRelations1705574901567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_37ce31b9a5733b42bfa2129471e\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP FOREIGN KEY \`FK_8243e482a615644d529f7a6f283\``);
        await queryRunner.query(`ALTER TABLE \`offloads_categories_categories\` DROP FOREIGN KEY \`FK_edb27ad68f252b24701c9312103\``);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` DROP FOREIGN KEY \`FK_235f9ab0b190966e5beb6194596\``);
        await queryRunner.query(`ALTER TABLE \`yields_categories_categories\` DROP FOREIGN KEY \`FK_bf6a459a38b27ca3f8bcc7f43fc\``);
        await queryRunner.query(`CREATE TABLE \`clients_offloads_offloads\` (\`clientsId\` int NOT NULL, \`offloadsId\` int NOT NULL, INDEX \`IDX_112203c6828facd101f94ad017\` (\`clientsId\`), INDEX \`IDX_53075f54fc49f3d26f149cd642\` (\`offloadsId\`), PRIMARY KEY (\`clientsId\`, \`offloadsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_offloads_offloads\` (\`usersId\` int NOT NULL, \`offloadsId\` int NOT NULL, INDEX \`IDX_96b34114bfa743fbbb4340009b\` (\`usersId\`), INDEX \`IDX_6df74ae87da1e6fe0d31facf1f\` (\`offloadsId\`), PRIMARY KEY (\`usersId\`, \`offloadsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`clients_offloads_offloads\` ADD CONSTRAINT \`FK_112203c6828facd101f94ad0179\` FOREIGN KEY (\`clientsId\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`clients_offloads_offloads\` ADD CONSTRAINT \`FK_53075f54fc49f3d26f149cd642b\` FOREIGN KEY (\`offloadsId\`) REFERENCES \`offloads\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_offloads_offloads\` ADD CONSTRAINT \`FK_96b34114bfa743fbbb4340009b5\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_offloads_offloads\` ADD CONSTRAINT \`FK_6df74ae87da1e6fe0d31facf1fc\` FOREIGN KEY (\`offloadsId\`) REFERENCES \`offloads\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offloads_categories_categories\` ADD CONSTRAINT \`FK_edb27ad68f252b24701c9312103\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` ADD CONSTRAINT \`FK_235f9ab0b190966e5beb6194596\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`yields_categories_categories\` ADD CONSTRAINT \`FK_bf6a459a38b27ca3f8bcc7f43fc\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`yields_categories_categories\` DROP FOREIGN KEY \`FK_bf6a459a38b27ca3f8bcc7f43fc\``);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` DROP FOREIGN KEY \`FK_235f9ab0b190966e5beb6194596\``);
        await queryRunner.query(`ALTER TABLE \`offloads_categories_categories\` DROP FOREIGN KEY \`FK_edb27ad68f252b24701c9312103\``);
        await queryRunner.query(`ALTER TABLE \`users_offloads_offloads\` DROP FOREIGN KEY \`FK_6df74ae87da1e6fe0d31facf1fc\``);
        await queryRunner.query(`ALTER TABLE \`users_offloads_offloads\` DROP FOREIGN KEY \`FK_96b34114bfa743fbbb4340009b5\``);
        await queryRunner.query(`ALTER TABLE \`clients_offloads_offloads\` DROP FOREIGN KEY \`FK_53075f54fc49f3d26f149cd642b\``);
        await queryRunner.query(`ALTER TABLE \`clients_offloads_offloads\` DROP FOREIGN KEY \`FK_112203c6828facd101f94ad0179\``);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD \`clientId\` int NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_6df74ae87da1e6fe0d31facf1f\` ON \`users_offloads_offloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_96b34114bfa743fbbb4340009b\` ON \`users_offloads_offloads\``);
        await queryRunner.query(`DROP TABLE \`users_offloads_offloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_53075f54fc49f3d26f149cd642\` ON \`clients_offloads_offloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_112203c6828facd101f94ad017\` ON \`clients_offloads_offloads\``);
        await queryRunner.query(`DROP TABLE \`clients_offloads_offloads\``);
        await queryRunner.query(`ALTER TABLE \`yields_categories_categories\` ADD CONSTRAINT \`FK_bf6a459a38b27ca3f8bcc7f43fc\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` ADD CONSTRAINT \`FK_235f9ab0b190966e5beb6194596\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads_categories_categories\` ADD CONSTRAINT \`FK_edb27ad68f252b24701c9312103\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_8243e482a615644d529f7a6f283\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offloads\` ADD CONSTRAINT \`FK_37ce31b9a5733b42bfa2129471e\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
