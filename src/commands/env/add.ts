import { Argv } from 'yargs';
import { addEnvironment } from '../../common/config-manager';
const chalk = require('chalk');

export const command = 'add <environmentName> <storeHash> <accessToken>';
export const describe = 'Add a new environment configuration';

export const builder = function (yargs: Argv) {
    return yargs
        .positional('environmentName', {
            describe: 'Name for the environment',
            type: 'string'
        })
        .positional('storeHash', {
            describe: 'BigCommerce store hash',
            type: 'string'
        })
        .positional('accessToken', {
            describe: 'BigCommerce access token',
            type: 'string'
        });
};

export const handler = function (argv: any) {
    const { environmentName, storeHash, accessToken } = argv;

    try {
        addEnvironment(environmentName, storeHash, accessToken);
        console.log(chalk.green(`✓ Environment '${environmentName}' added successfully`));
    } catch (error) {
        console.error(chalk.red('Error adding environment:'), error);
        process.exit(1);
    }
};
