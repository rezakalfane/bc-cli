import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { Argv } from "yargs"
import { mkdirSync } from "fs"
import { writeFileSync } from "fs"
import { join } from "path"
import Bottleneck from 'bottleneck'

export const command = 'export <folder>'
export const describe = 'Export all Products'
export const builder = function (yargs: Argv) {
    return yargs
        .positional("folder", {
            type: "string",
            describe: "Output folder"
        })
        .option("include-variants", {
            type: "boolean",
            describe: "Include variants"
        })
        .option("query", {
            type: "array",
            describe: "Add query parameters",
            default: []
        })
        .demandOption(["folder"], "Please provide output folder")
}
export function promiseAll(promises: Promise<any[]>[], errors: any[]) {
    return Promise.all(promises.map(async(p) => {
        return p.catch(e => {
            errors.push(e.response);
            return null;
        })
    }))
}

// Limiting API rate
const limiter = new Bottleneck({
    minTime: 250, //minimum time between requests
    maxConcurrent: 40, //maximum concurrent requests
});

function scheduleRequest(promise: Promise<any[]>) {
    return limiter.schedule(() => {
        return promise
    })
}

export const handler = async function (argv: any) {
    const credentials: BCClientCredentials = {
        storeHash: argv.storeHash,
        accessToken: argv.accessToken
    }
    const bcClient = new BCClient(credentials)
    const result = await bcClient.getProducts(1, argv.query)
    let allVariants: any[] = []
    let allVariantsPromises: Promise<any[]>[] = []
    let errors: any[] = []
    if (argv["include-variants"]) {
        allVariantsPromises = result.map(async (product) => {
            return scheduleRequest(bcClient.getAllProductVariants(product.id, 1))
        })
        allVariants = await promiseAll(allVariantsPromises, errors)
        if (errors.length) console.error(errors)
    }

    mkdirSync(argv.folder, { recursive: true });
    result.forEach(product => {
        const basename = `${product.id}~${product.name?.replace(/[^a-z0-9]/gi, '-')}`
        const filename = `${basename}.json`
        writeFileSync(join(argv.folder, filename), JSON.stringify(product, null, 4))
        if (argv["include-variants"]) {
            mkdirSync(join(argv.folder, `${product.id}`), { recursive: true });
        }
    })
    if (argv["include-variants"]) {
        allVariants.forEach((variants: any[]) => {
            if (variants.length) {
                variants.forEach(variant => {
                    const filename = `${variant.id}.json`
                    writeFileSync(join(argv.folder, `${variant.product_id}`, filename), JSON.stringify(variant, null, 4))
                })
            }
        })
    }
}
