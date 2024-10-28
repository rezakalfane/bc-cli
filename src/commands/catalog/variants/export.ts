import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { Argv } from "yargs"
import { mkdirSync } from "fs";
import { writeFileSync } from "fs";
import { join } from "path";

export const command = 'export <product-id> <folder>'
export const describe = 'Export all Variants for a Product'
export const builder = function (yargs: Argv) {
    return yargs
        .positional("product-id", {
            describe: "Product ID",
            type: "string"
        })
        .positional("folder", {
            type: "string",
            describe: "Output folder"
        })
        .option("query", {
            type: "array",
            describe: "Add query parameters",
            default: []
        })
        .demandOption(["folder"], "Please provide output folder")
}

export const handler = async function (argv: any) {
    const credentials: BCClientCredentials = {
        storeHash: argv.storeHash,
        accessToken: argv.accessToken
    }
    const bcClient = new BCClient(credentials)
    const result = await bcClient.getAllProductVariants(argv["product-id"], 1, argv.query)

    mkdirSync(join(argv.folder, argv["product-id"]), { recursive: true });
    result.forEach(variant => {
        const filename = `${variant.id}~${variant.sku.replace(/[^a-z0-9]/gi, '-')}.json`
        writeFileSync(join (argv.folder, argv["product-id"], filename), JSON.stringify(variant, null, 4))
    })
}
