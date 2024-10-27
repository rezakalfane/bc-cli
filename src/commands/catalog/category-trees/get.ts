import { writeFileSync } from "fs";
import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { generateCsv } from "../../../common/utils"
import { Argv } from "yargs"
import { colorize } from 'json-colorizer'
import Table from 'cli-table3'

export const command = 'get <tree-id>'
export const describe = 'Get a Category Tree'
export const builder = function (yargs: Argv) {
    return yargs
        .positional("tree-id", {
            describe: "Category Tree ID",
            type: "string"
        })
        .option("extra-fields", {
            type: "array",
            describe: "Retrieve additional fields",
            default: []
        })
        .option("top-level", {
            type: "boolean",
            describe: "Get only Top Level Categories"
        })
        .option("file", {
            type: "string",
            describe: "Output as JSON file",
        })
        .option("json", {
            type: "boolean",
            describe: "Output as JSON"
        })
        .option("flatten", {
            type: "boolean",
            describe: "Flatten JSON structure"
        })
        .option("no_parent_id", {
            type: "boolean",
            describe: "Remove Parent ID from JSON entries"
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
    const result = await bcClient.getSingleCategoryTree(argv["tree-id"])
    let finalOutput: string = ""
    if (argv.json) {
        if (argv.flatten) {
            const categories_payload: any[] = []
            const extract_cats = (item: any) => {
                const { children, ...filteredItem } = item
                if (argv.no_parent_id) {
                    delete filteredItem.parent_id
                }
                categories_payload.push(filteredItem)
                if (!argv["top-level"] && item.children)
                    item.children.forEach((child: any) => extract_cats(child))
            }
            result.forEach(item => extract_cats(item))
            finalOutput = JSON.stringify(categories_payload, null, 4)
        } else {
            finalOutput = JSON.stringify(result, null, 4)
        }
        if (!argv.file) {
            finalOutput = colorize(finalOutput)
        }
    } else {
        const header: string[] = [
            "id",
            "parent_id",
            "name",
            "is_visible",
            "path",
            "url",
            ...argv["extra-fields"]
        ]
        const values: string[][] = []
        const extract_cats = (item: any) => {
            const value = [
                item.id,
                item.parent_id,
                item.name,
                item.is_visible,
                item.path?.join(","),
                item.url
            ]
            argv["extra-fields"].forEach((field: string) => value.push(item[field]))
            values.push(value)
            if (!argv["top-level"] && item.children)
                item.children.forEach((child: any) => extract_cats(child))
        }
        result.forEach(item => extract_cats(item))
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
