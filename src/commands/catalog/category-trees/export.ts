import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { Argv } from "yargs"
import { mkdirSync } from "fs";
import { writeFileSync } from "fs";
import { join } from "path";

export const command = 'export <folder>'
export const describe = 'Export all Category Trees'
export const builder = function (yargs: Argv) {
    return yargs
        .positional("folder", {
            type: "string",
            describe: "Output folder"
        })
        .demandOption(["folder"], "Please provide output folder")
}

export const handler = async function (argv: any) {
    const credentials: BCClientCredentials = {
        storeHash: argv.storeHash,
        accessToken: argv.accessToken
    }
    const bcClient = new BCClient(credentials)
    const result = await bcClient.getCategoryTrees()

    mkdirSync(argv.folder, { recursive: true });
    result.forEach(tree => {
        const filename = `${tree.id}~${tree.name.replace(/[^a-z0-9]/gi, '-')}.json`
        writeFileSync(join (argv.folder, filename), JSON.stringify(tree, null, 4))
    })
}
