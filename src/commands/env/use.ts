import { Argv } from 'yargs';
import { setDefaultEnvironment } from '../../common/config-manager';
const chalk = require('chalk');

export const command = 'use <environmentName>';
export const describe = 'Set the default environment';

export const builder = function (yargs: Argv) {
    return yargs
        .positional('environmentName', {
            describe: 'Name of the environment to use as default',
            type: 'string'
        });
};

export const handler = function (argv: any) {
    const { environmentName } = argv;

    try {
        const success = setDefaultEnvironment(environmentName);

        if (success) {
            console.log(chalk.green(`✓ Default environment set to '${environmentName}'`));
        } else {
            console.error(chalk.red(`✗ Environment '${environmentName}' not found`));
            console.log(chalk.gray('Use "bc-cli env list" to see available environments'));
            process.exit(1);
        }
    } catch (error) {
        console.error(chalk.red('Error setting default environment:'), error);
        process.exit(1);
    }
};
