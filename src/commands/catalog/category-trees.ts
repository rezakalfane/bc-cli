import { Argv } from "yargs"

export const command = 'category-trees'
export const describe = 'Category Trees commands'
export const builder = function (yargs: Argv) {
    return yargs
        .commandDir('category-trees', {
            extensions: process.env.NODE_ENV === 'development' ? ['js', 'ts'] : ['js']
        })
        .demandCommand(1, "Please specify at least one command")
}

export const handler = function (argv: Argv) {
}
