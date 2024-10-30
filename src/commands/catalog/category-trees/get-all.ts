import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { Argv } from "yargs"
import { writeFileSync } from 'fs'
import { generateCsv } from '../../../common/utils'
import { colorize } from 'json-colorizer'
import Table from 'cli-table3'

export const command = 'get-all'
export const describe = 'Get all Category Trees'
export const builder = function (yargs: Argv) {
    return yargs
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
}

export const handler = async function (argv: any) {
    const credentials: BCClientCredentials = {
        storeHash: argv.storeHash,
        accessToken: argv.accessToken
    }
    const bcClient = new BCClient(credentials)
    const result = await bcClient.getCategoryTrees()
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
            "channels"
        ]
        const values: string[][] = []
        result.forEach(item => values.push([
            item.id, 
            item.name, 
            item.channels?.join(", ")
        ]))
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
