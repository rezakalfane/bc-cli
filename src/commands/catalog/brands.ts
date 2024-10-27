import { Argv } from "yargs"

export const command = 'brands'
export const describe = 'Brands commands'
export const builder = function (yargs: Argv) {
    return yargs
        .commandDir('brands', {
            extensions: process.env.NODE_ENV === 'development' ? ['js', 'ts'] : ['js']
        })
        .demandCommand(1, "Please specify at least one command")
}

export const handler = function (argv: Argv) {
}
