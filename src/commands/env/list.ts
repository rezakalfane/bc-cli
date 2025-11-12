import { Argv } from 'yargs';
import { getAllEnvironments } from '../../common/config-manager';
import Table from 'cli-table3';
const chalk = require('chalk');

export const command = 'list';
export const describe = 'List all configured environments';

export const builder = function (yargs: Argv) {
    return yargs;
};

export const handler = function (argv: any) {
    try {
        const environments = getAllEnvironments();

        if (environments.length === 0) {
            console.log(chalk.yellow('No environments configured'));
            console.log(chalk.gray('Use "bc-cli env add <name> <storeHash> <accessToken>" to add an environment'));
            return;
        }

        const table = new Table({
            head: [
                chalk.cyan('Environment'),
                chalk.cyan('Store Hash'),
                chalk.cyan('Access Token'),
                chalk.cyan('Default')
            ],
            colWidths: [25, 20, 40, 10]
        });

        environments.forEach(({ name, environment, isDefault }) => {
            const envName = isDefault ? chalk.green.bold(`${name} *`) : name;
            const maskedToken = environment.accessToken.substring(0, 10) + '...' +
                               environment.accessToken.substring(environment.accessToken.length - 4);
            const defaultMarker = isDefault ? chalk.green('✓') : '';

            table.push([
                envName,
                environment.storeHash,
                maskedToken,
                defaultMarker
            ]);
        });

        console.log(table.toString());
        console.log();
        console.log(chalk.gray('* = default environment'));
    } catch (error) {
        console.error(chalk.red('Error listing environments:'), error);
        process.exit(1);
    }
};
