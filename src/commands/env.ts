import { Argv } from 'yargs';

export const command = 'env';
export const describe = 'Environments: Manage BigCommerce store environments';

export const builder = function (yargs: Argv) {
    return yargs
        .commandDir('env', {
            extensions: process.env.NODE_ENV === 'development' ? ['js', 'ts'] : ['js']
        })
        .demandCommand(1, "Please specify at least one command");
};

export const handler = function (argv: Argv) {
};
