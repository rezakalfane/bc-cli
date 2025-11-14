#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import dotenv from 'dotenv'
import { getDefaultEnvironment } from './common/config-manager'

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` }); // loads the environment specific .env if any

// Load default environment from config (takes priority over .env file)
const defaultEnv = getDefaultEnvironment();
const storeHash = defaultEnv?.storeHash || process.env.STORE_HASH;
const accessToken = defaultEnv?.accessToken || process.env.ACCESS_TOKEN;

// Check if command is an env command (doesn't require credentials)
const args = hideBin(process.argv);
const isEnvCommand = args[0] === 'env';

yargs(args)
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
        describe: "Store Hash"
    })
    .option("accessToken", {
        type: "string",
        describe: "accessToken"
    })
    .check((argv) => {
        // Skip credential validation for env commands
        if (isEnvCommand) {
            return true;
        }

        // Require credentials for all other commands
        if (!argv.storeHash || !argv.accessToken) {
            throw new Error('Please provide both store hash and access token via CLI options, environment variables, or by configuring an environment with "bc-cli env add"');
        }

        return true;
    })
    .help()
    .parse();
