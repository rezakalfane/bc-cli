import { Argv } from "yargs"

export const command = 'admin'
export const describe = 'Admin commands'
export const builder = function (yargs: Argv) {
    return yargs
        .commandDir('admin', {
            extensions: process.env.NODE_ENV === 'development' ? ['js', 'ts'] : ['js']
        })
        .demandCommand(1, "Please specify at least one command")
}

export const handler = function (argv: Argv) {
}
