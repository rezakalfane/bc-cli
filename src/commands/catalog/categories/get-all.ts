import { writeFileSync } from "fs";
import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { generateCsv, generateTsv } from "../../../common/utils"
import { Argv } from "yargs"
import { colorize } from 'json-colorizer'
import Table from 'cli-table3'

export const command = 'get-all'
export const describe = 'Get all Categories'
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
    const result = await bcClient.getAllCategories(argv.query)
    const categoryTrees = await bcClient.getCategoryTrees()
    let finalOutput: string = ""
    if (argv.json) {
        finalOutput = JSON.stringify(result, null, 4)
        if (!argv.file) {
            finalOutput = colorize(finalOutput)
        }
    } else {
        const header: string[] = [
            "category_id", 
            argv["follow-id"] ? "parent_name" : "parent_id", 
            argv["follow-id"] ? "tree_name" : "tree_id", 
            "name", 
            "is_visible", 
            "url", 
            ...argv["extra-fields"]
        ]
        const values: string[][] = []
        const extract_cats = (item: any) => {
            const value = [
                item.category_id, 
                !argv["follow-id"] ? item.parent_id : result.find(cat => cat.category_id === item.parent_id)?.name, 
                !argv["follow-id"] ? item.tree_id : categoryTrees.find(tree => tree.id === item.tree_id)?.name, 
                item.name, 
                item.is_visible, 
                item.url?.path
            ]
            argv["extra-fields"].forEach((field: string) => value.push(item[field]))
            values.push(value)
        }
        result.forEach(item => extract_cats(item))
        if (argv.csv) {
            finalOutput = generateCsv(header, values)
        } else if (argv.tsv) {
            finalOutput = generateTsv(header, values)
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
