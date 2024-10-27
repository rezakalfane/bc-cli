import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { Argv } from "yargs"
import { writeFileSync } from 'fs'
import { generateCsv } from '../../../common/utils'
import { colorize } from 'json-colorizer'
import Table from 'cli-table3'

export const command = 'get-all <product-id>'
export const describe = 'Get all Product Variants'
export const builder = function (yargs: Argv) {
    return yargs
        .positional("product-id", {
            describe: "Product ID",
            type: "string"
        })
        .option("query", {
            type: "array",
            describe: "Add query parameters",
            default: []
        })
        .option("extra-fields", {
            type: "array",
            describe: "Retrieve additional fields",
            default: []
        })
        .option("file", {
            type: "string",
            describe: "Output as JSON file",
        })
        .option("json", {
            type: "boolean",
            describe: "Output as JSON"
        })
        .option("csv", {
            type: "boolean",
            describe: "Output as CSV"
        })
}

export const handler = async function (argv: any) {
    const credentials: BCClientCredentials = {
        storeHash: argv.storeHash,
        accessToken: argv.accessToken
    }
    const bcClient = new BCClient(credentials)
    const result = await bcClient.getAllProductVariants(argv["product-id"], 1, argv.query)
    let finalOutput: string = ""
    if (argv.json) {
        finalOutput = JSON.stringify(result, null, 4)
        if (!argv.file) {
            finalOutput = colorize(finalOutput)
        }
    } else {
        const header: string[] = [
            "id", 
            "product_id",
            "sku", 
            "sku_id", 
            "price", 
            "sale_price", 
            "inventory_level", 
            "option_values", 
            ...argv["extra-fields"]
        ]
        const values: string[][] = []
        result.forEach(item => { 
            let option_values = ""
            if (item.option_values) {
                item.option_values.forEach((option: any, index: number) => {
                    if (index > 0) option_values += ", "
                    option_values += option.option_display_name
                    option_values += "="
                    option_values += option.label
                })
            }
            const value = [
                item.id, 
                item.product_id, 
                item.sku, 
                item.sku_id, 
                item.price, 
                item.sale_price, 
                item.inventory_level, 
                option_values
            ]            
            argv["extra-fields"].forEach((field: string) => value.push(item[field]))
            values.push(value)
        })
        if (argv.csv) {
            finalOutput = generateCsv(header, values)
        } else {
            const tableConfig: any = { head: header } 
            if (argv.file) {
                tableConfig.style = {
                    head: [],
                    border: [],
                }
            }
            const table = new Table(tableConfig)
            values.forEach(value => table.push(value))
            finalOutput = table.toString()
        }
    }
    if (argv.file) {
        writeFileSync(argv.file, finalOutput)
    } else {
        console.log(finalOutput)
    }
}