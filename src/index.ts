#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import dotenv from 'dotenv'

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` }); // loads the environment specific .env if any

yargs(hideBin(process.argv))
    .scriptName("bc-cli")
    .strict()
    .version()
    .alias('v', 'version')
    .alias('h', 'help')
    .usage('Usage: $0 <command> [options]')
    .commandDir('commands', {
        extensions: process.env.NODE_ENV === 'development' ? ['js', 'ts'] : ['js']
    })
    .demandCommand(1, "Please specify at least one command")
    .option("storeHash", {
        type: "string",
        describe: "Store Hash",
        default: process.env.STORE_HASH
    })
    .option("accessToken", {
        type: "string",
        describe: "accessToken",
        default: process.env.ACCESS_TOKEN
    })
    .demandOption(['storeHash', 'accessToken'], 'Please provide both store hash and access token arguments')
    .help()
    .parse();
