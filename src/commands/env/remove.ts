import { Argv } from 'yargs';
import { removeEnvironment } from '../../common/config-manager';
const chalk = require('chalk');

export const command = 'remove <environmentName>';
export const describe = 'Remove an environment configuration';

export const builder = function (yargs: Argv) {
    return yargs
        .positional('environmentName', {
            describe: 'Name of the environment to remove',
            type: 'string'
        });
};

export const handler = function (argv: any) {
    const { environmentName } = argv;

    try {
        const success = removeEnvironment(environmentName);

        if (success) {
            console.log(chalk.green(`✓ Environment '${environmentName}' removed successfully`));
        } else {
            console.error(chalk.red(`✗ Environment '${environmentName}' not found`));
            console.log(chalk.gray('Use "bc-cli env list" to see available environments'));
            process.exit(1);
        }
    } catch (error) {
        console.error(chalk.red('Error removing environment:'), error);
        process.exit(1);
    }
};
