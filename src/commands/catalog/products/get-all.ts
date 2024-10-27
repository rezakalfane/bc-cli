import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { Argv } from "yargs"
import { writeFileSync } from 'fs'
import { generateCsv } from '../../../common/utils'
import { colorize } from 'json-colorizer'
import Table from 'cli-table3'

export const command = 'get-all'
export const describe = 'Get all Products'
export const builder = function (yargs: Argv) {
    return yargs
        .option("follow-id", {
            type: "boolean",
            describe: "Get entities name from id"
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
    const result = await bcClient.getProducts(1, argv.query)
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
            "sku", 
            "price", 
            "sale_price", 
            "categories", 
            argv["follow-id"] ? "brand_name" : "brand_id", 
            "url", 
            ...argv["extra-fields"]
        ]
        const values: string[][] = []
        result.forEach(item => {
            const value = [
                item.id, 
                item.name, 
                item.sku, 
                item.price, 
                item.sale_price, 
                !argv["follow-id"] ? item.categories?.join(',') : item.categories?.map((category: number) => {
                    const match = categories.find(cat => cat.category_id === category)
                    return match.name
                }).join(", "),
                !argv["follow-id"] ? item.brand_id : brands.find(brand => brand.id === item.brand_id)?.name,
                item.custom_url?.url
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