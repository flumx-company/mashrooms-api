import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1706543218570 implements MigrationInterface {
    name = 'InitialSchema1706543218570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`clients\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`firstName\` varchar(35) NULL, \`lastName\` varchar(35) NULL, \`phone\` varchar(20) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`firstName\` varchar(35) NULL, \`patronymic\` varchar(35) NULL, \`lastName\` varchar(35) NULL, \`email\` varchar(254) NULL, \`phone\` varchar(20) NULL, \`password\` varchar(255) NULL, \`role\` enum ('1', '2') NOT NULL DEFAULT '2', \`position\` enum ('SUPERADMINISTRATOR', 'FOREMAN', 'OFFICE_ADMINISTRATOR') NOT NULL DEFAULT 'FOREMAN', \`permissions\` text NULL, \`isActive\` tinyint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`offloads\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`picking\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(70) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(100) NULL, \`description\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`yields\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(70) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pays\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`tenant\` enum ('BARREL', 'BOX', 'KITCHEN') NOT NULL DEFAULT 'BARREL', \`pay\` decimal(10,2) NOT NULL DEFAULT '0.00', \`startTime\` date NOT NULL, \`endTime\` date NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employees\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`firstName\` varchar(35) NULL, \`lastName\` varchar(35) NULL, \`phone\` varchar(20) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`drivers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`firstName\` varchar(35) NULL, \`lastName\` varchar(35) NULL, \`phone\` varchar(20) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clients_offloads_offloads\` (\`clientsId\` int NOT NULL, \`offloadsId\` int NOT NULL, INDEX \`IDX_112203c6828facd101f94ad017\` (\`clientsId\`), INDEX \`IDX_53075f54fc49f3d26f149cd642\` (\`offloadsId\`), PRIMARY KEY (\`clientsId\`, \`offloadsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users_offloads_offloads\` (\`usersId\` int NOT NULL, \`offloadsId\` int NOT NULL, INDEX \`IDX_96b34114bfa743fbbb4340009b\` (\`usersId\`), INDEX \`IDX_6df74ae87da1e6fe0d31facf1f\` (\`offloadsId\`), PRIMARY KEY (\`usersId\`, \`offloadsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`offloads_categories_categories\` (\`offloadsId\` int NOT NULL, \`categoriesId\` int NOT NULL, INDEX \`IDX_e8e15ed572693eb7a124ff1d56\` (\`offloadsId\`), INDEX \`IDX_edb27ad68f252b24701c931210\` (\`categoriesId\`), PRIMARY KEY (\`offloadsId\`, \`categoriesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`picking_categories_categories\` (\`pickingId\` int NOT NULL, \`categoriesId\` int NOT NULL, INDEX \`IDX_e4b939cb74c8c1b943f920dbaa\` (\`pickingId\`), INDEX \`IDX_235f9ab0b190966e5beb619459\` (\`categoriesId\`), PRIMARY KEY (\`pickingId\`, \`categoriesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`yields_categories_categories\` (\`yieldsId\` int NOT NULL, \`categoriesId\` int NOT NULL, INDEX \`IDX_90a38c291ce3b7b83a2d6052d4\` (\`yieldsId\`), INDEX \`IDX_bf6a459a38b27ca3f8bcc7f43f\` (\`categoriesId\`), PRIMARY KEY (\`yieldsId\`, \`categoriesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`clients_offloads_offloads\` ADD CONSTRAINT \`FK_112203c6828facd101f94ad0179\` FOREIGN KEY (\`clientsId\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`clients_offloads_offloads\` ADD CONSTRAINT \`FK_53075f54fc49f3d26f149cd642b\` FOREIGN KEY (\`offloadsId\`) REFERENCES \`offloads\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users_offloads_offloads\` ADD CONSTRAINT \`FK_96b34114bfa743fbbb4340009b5\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_offloads_offloads\` ADD CONSTRAINT \`FK_6df74ae87da1e6fe0d31facf1fc\` FOREIGN KEY (\`offloadsId\`) REFERENCES \`offloads\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offloads_categories_categories\` ADD CONSTRAINT \`FK_e8e15ed572693eb7a124ff1d568\` FOREIGN KEY (\`offloadsId\`) REFERENCES \`offloads\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`offloads_categories_categories\` ADD CONSTRAINT \`FK_edb27ad68f252b24701c9312103\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` ADD CONSTRAINT \`FK_e4b939cb74c8c1b943f920dbaa5\` FOREIGN KEY (\`pickingId\`) REFERENCES \`picking\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` ADD CONSTRAINT \`FK_235f9ab0b190966e5beb6194596\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`yields_categories_categories\` ADD CONSTRAINT \`FK_90a38c291ce3b7b83a2d6052d4f\` FOREIGN KEY (\`yieldsId\`) REFERENCES \`yields\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`yields_categories_categories\` ADD CONSTRAINT \`FK_bf6a459a38b27ca3f8bcc7f43fc\` FOREIGN KEY (\`categoriesId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`yields_categories_categories\` DROP FOREIGN KEY \`FK_bf6a459a38b27ca3f8bcc7f43fc\``);
        await queryRunner.query(`ALTER TABLE \`yields_categories_categories\` DROP FOREIGN KEY \`FK_90a38c291ce3b7b83a2d6052d4f\``);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` DROP FOREIGN KEY \`FK_235f9ab0b190966e5beb6194596\``);
        await queryRunner.query(`ALTER TABLE \`picking_categories_categories\` DROP FOREIGN KEY \`FK_e4b939cb74c8c1b943f920dbaa5\``);
        await queryRunner.query(`ALTER TABLE \`offloads_categories_categories\` DROP FOREIGN KEY \`FK_edb27ad68f252b24701c9312103\``);
        await queryRunner.query(`ALTER TABLE \`offloads_categories_categories\` DROP FOREIGN KEY \`FK_e8e15ed572693eb7a124ff1d568\``);
        await queryRunner.query(`ALTER TABLE \`users_offloads_offloads\` DROP FOREIGN KEY \`FK_6df74ae87da1e6fe0d31facf1fc\``);
        await queryRunner.query(`ALTER TABLE \`users_offloads_offloads\` DROP FOREIGN KEY \`FK_96b34114bfa743fbbb4340009b5\``);
        await queryRunner.query(`ALTER TABLE \`clients_offloads_offloads\` DROP FOREIGN KEY \`FK_53075f54fc49f3d26f149cd642b\``);
        await queryRunner.query(`ALTER TABLE \`clients_offloads_offloads\` DROP FOREIGN KEY \`FK_112203c6828facd101f94ad0179\``);
        await queryRunner.query(`DROP INDEX \`IDX_bf6a459a38b27ca3f8bcc7f43f\` ON \`yields_categories_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_90a38c291ce3b7b83a2d6052d4\` ON \`yields_categories_categories\``);
        await queryRunner.query(`DROP TABLE \`yields_categories_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_235f9ab0b190966e5beb619459\` ON \`picking_categories_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_e4b939cb74c8c1b943f920dbaa\` ON \`picking_categories_categories\``);
        await queryRunner.query(`DROP TABLE \`picking_categories_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_edb27ad68f252b24701c931210\` ON \`offloads_categories_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_e8e15ed572693eb7a124ff1d56\` ON \`offloads_categories_categories\``);
        await queryRunner.query(`DROP TABLE \`offloads_categories_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_6df74ae87da1e6fe0d31facf1f\` ON \`users_offloads_offloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_96b34114bfa743fbbb4340009b\` ON \`users_offloads_offloads\``);
        await queryRunner.query(`DROP TABLE \`users_offloads_offloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_53075f54fc49f3d26f149cd642\` ON \`clients_offloads_offloads\``);
        await queryRunner.query(`DROP INDEX \`IDX_112203c6828facd101f94ad017\` ON \`clients_offloads_offloads\``);
        await queryRunner.query(`DROP TABLE \`clients_offloads_offloads\``);
        await queryRunner.query(`DROP TABLE \`drivers\``);
        await queryRunner.query(`DROP TABLE \`employees\``);
        await queryRunner.query(`DROP TABLE \`pays\``);
        await queryRunner.query(`DROP TABLE \`yields\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`picking\``);
        await queryRunner.query(`DROP TABLE \`offloads\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`clients\``);
    }

}
