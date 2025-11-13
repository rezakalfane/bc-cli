import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { Argv } from "yargs"
import { writeFileSync } from 'fs'
import { generateCsv, generateTsv } from '../../../common/utils'
import { colorize } from 'json-colorizer'
import Table from 'cli-table3'
const chalk = require("chalk")

export const command = 'get <product-id>'
export const describe = 'Get single Product'
export const builder = function (yargs: Argv) {
    return yargs
        .positional("product-id", {
            describe: "Product ID",
            type: "string"
        })
        .option("follow-id", {
            type: "boolean",
            describe: "Get entities name from id"
        }) 
        .option("extra-fields", {
            type: "array",
            describe: "Retrieve additional fields",
            default: []
        })
        .option("file", {
            type: "string",
            describe: "Output as file",
        })
        .option("json", {
            type: "boolean",
            describe: "Output as JSON"
        })
        .option("csv", {
            type: "boolean",
            describe: "Output as CSV"
        })
        .option("tsv", {
            type: "boolean",
            describe: "Output as TSV"
        })
}

export const handler = async function (argv: any) {
    const credentials: BCClientCredentials = {
        storeHash: argv.storeHash,
        accessToken: argv.accessToken
    }
    const bcClient = new BCClient(credentials)
    const result = await bcClient.getProduct(argv["product-id"])
    const brands = await bcClient.getBrands()
    const categories = await bcClient.getAllCategories()
    let finalOutput: string = ""
    if (argv.json) {
        finalOutput = JSON.stringify(result, null, 4)
        if (!argv.file) {
            finalOutput = colorize(finalOutput)
        }
    } else {
        const header: string[] = [
            "id", 
            "name", 
            "description",
            "sku", 
            "price", 
            "sale_price", 
            "categories", 
            argv["follow-id"] ? "brand_name" : "brand_id", 
            "url", 
            ...argv["extra-fields"]
        ]
        const value = [
            result.id, 
            result.name, 
            result.description,
            result.sku, 
            result.price, 
            result.sale_price, 
            !argv["follow-id"] ? result.categories?.join(',') : result.categories?.map((category: number) => {
                const match = categories.find(cat => cat.category_id === category)
                return match.name
            }).join(", "),
            !argv["follow-id"] ? result.brand_id : brands.find(brand => brand.id === result.brand_id)?.name,
            result.custom_url?.url
        ]
        argv["extra-fields"].forEach((field: string) => value.push(result[field]))
        if (argv.csv) {
            finalOutput = generateCsv(header, [value])
        } else if (argv.tsv) {
            finalOutput = generateTsv(header, [value])
        } else {
            // const tableConfig: any = { head: header }
            const tableConfig: any = {
                colWidths: [, 120],
                wordWrap: true
            }
            if (argv.file) {
                tableConfig.style = {
                    head: [],
                    border: [],
                }
            }
            const table = new Table(tableConfig)
            header.forEach((item: string, index: number) => table.push({[chalk.red(item)]: value[index]}))
            // table.push(value)
            finalOutput = table.toString()
        }
    }
    if (argv.file) {
        writeFileSync(argv.file, finalOutput)
    } else {
        console.log(finalOutput)
    }
}