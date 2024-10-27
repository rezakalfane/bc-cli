import { Argv } from "yargs"

export const command = 'catalog'
export const describe = 'Catalog commands'
export const builder = function (yargs: Argv) {
    return yargs
        .commandDir('catalog', {
            extensions: process.env.NODE_ENV === 'development' ? ['js', 'ts'] : ['js']
        })
        .demandCommand(1, "Please specify at least one command")
}

export const handler = function (argv: Argv) {
}
